CREATE TYPE "public"."build" AS ENUM('skinny', 'slim', 'regular', 'sport', 'fat');--> statement-breakpoint
CREATE TYPE "public"."bust_size" AS ENUM('very_small', 'small_a', 'medium_b', 'large_c', 'very_large_d', 'enormous_e_plus');--> statement-breakpoint
CREATE TYPE "public"."ethnicity" AS ENUM('georgian', 'russian', 'black', 'turk', 'armenian', 'azerbaijan', 'kazakh', 'greek', 'ukraine', 'other');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('female', 'male', 'transsexual');--> statement-breakpoint
CREATE TYPE "public"."hair_color" AS ENUM('black', 'blonde', 'brown', 'brunette', 'chestnut', 'auburn', 'dark_blonde', 'golden', 'red', 'grey', 'silver', 'other');--> statement-breakpoint
CREATE TYPE "public"."language_level" AS ENUM('minimal', 'conversational', 'fluent');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'escort', 'admin');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('new', 'in_progress', 'resolved', 'closed');--> statement-breakpoint
CREATE TYPE "public"."contact_type" AS ENUM('support', 'inquiry', 'complaint', 'feedback', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_reason" AS ENUM('fake_profile', 'inappropriate_content', 'scam', 'underage', 'spam', 'other');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('pending', 'reviewed', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"is_vip" boolean DEFAULT false NOT NULL,
	"vip_expires_at" timestamp,
	"is_top" boolean DEFAULT false NOT NULL,
	"top_expires_at" timestamp,
	"is_vip_elite" boolean DEFAULT false NOT NULL,
	"vip_elite_expires_at" timestamp,
	"name" text,
	"phone" text NOT NULL,
	"whatsapp_available" boolean DEFAULT false,
	"viber_available" boolean DEFAULT false,
	"website" text,
	"instagram" text,
	"snapchat" text,
	"twitter" text,
	"facebook" text,
	"city" text NOT NULL,
	"district" text,
	"gender" "gender" NOT NULL,
	"date_of_birth" date NOT NULL,
	"ethnicity" "ethnicity" NOT NULL,
	"hair_color" "hair_color",
	"bust_size" "bust_size",
	"height" integer NOT NULL,
	"weight" numeric(5, 2) NOT NULL,
	"build" "build",
	"incall_available" boolean DEFAULT false,
	"outcall_available" boolean DEFAULT false,
	"about_you" text NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb,
	"currency" text DEFAULT 'GEL' NOT NULL,
	"rates" jsonb,
	"services" text[] DEFAULT '{}',
	"tags" text[] DEFAULT '{}',
	"last_active" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "phone_clicks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"clicker_ip" text,
	"clicked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"viewer_ip" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_queries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"query" text,
	"filters" text,
	"results_count" integer,
	"user_ip" text,
	"searched_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"type" "contact_type" DEFAULT 'support' NOT NULL,
	"status" "contact_status" DEFAULT 'new' NOT NULL,
	"user_ip" text,
	"admin_response" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"reason" "report_reason" NOT NULL,
	"description" text,
	"reporter_name" text,
	"reporter_email" text,
	"reporter_ip" text,
	"status" "report_status" DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"type" text NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "verification_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "phone_clicks" ADD CONSTRAINT "phone_clicks_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_views" ADD CONSTRAINT "profile_views_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;