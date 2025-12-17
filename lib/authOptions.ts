import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

const normalizeEmail = (value?: string | null) => value?.toLowerCase().trim();

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();
        const normalizedEmail = normalizeEmail(credentials.email);
        if (!normalizedEmail) return null;

        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) return null;

        // If the account was created via Google, credentials login is not allowed.
        if (user.provider !== "credentials" || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        // Keep login metadata up to date.
        await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image || null,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Ensure we always have the google profile id and avatar handy.
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;
      if (account.provider !== "google") {
        if ((user as { id?: string }).id) {
          await User.updateOne(
            { _id: (user as { id?: string }).id },
            { $set: { lastLoginAt: new Date() } }
          );
        }
        return true;
      }

      await connectToDatabase();

      const email = normalizeEmail(user.email);
      if (!email) return false;

      const googleId =
        (profile as { sub?: string } | undefined)?.sub ?? account.providerAccountId ?? undefined;
      const image = (profile as { picture?: string } | undefined)?.picture ?? user.image;

      const query = googleId
        ? { $or: [{ googleId }, { email }] }
        : { email };

      const existingUser = await User.findOneAndUpdate(
        query,
        {
          $setOnInsert: {
            name: user.name ?? profile?.name ?? "Google User",
            email,
            provider: "google",
          },
          $set: {
            ...(googleId ? { googleId } : {}),
            ...(image ? { image } : {}),
            lastLoginAt: new Date(),
          },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );

      if (!existingUser) return false;

      (user as { id?: string }).id = existingUser._id.toString();
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.id;
        token.image = (user as { image?: string | null }).image ?? token.image;
      }
      // Ensure token contains the database id for OAuth logins on subsequent requests.
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      if (!token.id && token.email) {
        await connectToDatabase();
        const normalizedEmail = normalizeEmail(token.email);
        const existingUser = normalizedEmail
          ? await User.findOne({ email: normalizedEmail }).select("_id image")
          : null;
        if (existingUser) {
          token.id = existingUser._id.toString();
          if (!token.image) {
            token.image = existingUser.image || null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id) {
          (session.user as { id?: string }).id = token.id as string;
        }
        if (token?.image !== undefined) {
          (session.user as { image?: string | null }).image = token.image as string | null;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

