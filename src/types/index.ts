export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  oauth_token_secret: string | null;
  oauth_token: string | null;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
};
export type VerificationToken = {
  id: string;
  identifier: string;
  token: string;
  expires: Date;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  osis: string | null;
  role: Role;
};
export type UserMetadata = {
  key: string;
  value: number;
  public: boolean;
  userId: string;
};
export type Event = {
  id: string;
  name: string;
  description: string;
  color: string;
  slug: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
};
export type EventLink = {
  id: string;
  name: string;
  enabled: boolean;
  code: string;
  eventId: string;
  uses: number | null;
  createdAt: Date;
  updatedAt: Date;
};
export type EventLinkRedeem = {
  userId: string;
  eventLinkId: string;
  status: EventLinkRedeemStatus;
  statusDescription: string;
  createdAt: Date;
  updatedAt: Date;
};
export type LinkApplyInstructions = {
  key: string;
  value: number;
  public: boolean;
  action: KeyValueAction;
  eventLinkId: string;
};
export type EventTask = {
  id: string;
  name: string;
  description: string;
  eventTaskId: string | null;
};
export enum Role {
  MEMBER = "MEMBER",
  EXEC = "EXEC",
}
export enum EventLinkRedeemStatus {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}
export enum KeyValueAction {
  INCREMENT = "INCREMENT",
  DECREMENT = "DECREMENT",
  SET = "SET",
}
