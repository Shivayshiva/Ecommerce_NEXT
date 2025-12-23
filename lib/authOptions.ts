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
          userType: user.userType,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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
      console.log("GHGHGH_GHGHGH_GHGH_GHGHGH", existingUser)

      if (!existingUser) return false;


      (user as { id?: string }).id = existingUser._id.toString();
      // Propagate a guaranteed userType onto the OAuth user object so downstream
      // callbacks (jwt/session) receive it. Default to "customer" when missing.
      (user as { userType?: "admin" | "customer" }).userType =
        existingUser?.userType ;
      console.log("DFDFDFDFDFDFDFDF___DFDFDF", user, "-----", existingUser)
      return true;
    },
    async jwt({ token, user }) {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", token, user)
      if (user) {
        token.id = (user as { id?: string }).id ?? token.id;
        token.image = (user as { image?: string | null }).image ?? token.image;
        token.userType = (user as { userType?: "admin" | "customer" }).userType ?? token.userType;
      }
      // Ensure token contains the database id for OAuth logins on subsequent requests.
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      
      // If userType is missing from token, fetch it from database
      if (!token.userType) {
        await connectToDatabase();
        let existingUser = null;
        
        if (token.id) {
          existingUser = await User.findById(token.id).select("userType image");
        } else if (token.email) {
          const normalizedEmail = normalizeEmail(token.email);
          existingUser = normalizedEmail
            ? await User.findOne({ email: normalizedEmail }).select("_id image userType")
            : null;
        }
        
        if (existingUser) {
          if (!token.id) {
            token.id = existingUser._id.toString();
          }
          if (!token.image) {
            token.image = existingUser.image || null;
          }
          token.userType = existingUser.userType;
        }
      }
      console.log("token_______token_toekn", token)
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
        if ((token as { userType?: "admin" | "customer" }).userType) {
          (session.user as { userType?: "admin" | "customer" }).userType = (
            token as { userType?: "admin" | "customer" }
          ).userType;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

