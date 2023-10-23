export type UserLoginToken = {
  _id: string;
  role: string[];
};

type Video = {
  name: string;
  url: string;
  fileId: string;
}

export type UserType = {
  _id: string;
  name: string | null;
  role: string[];
  email: string;
  birthdate: string;
  twitter: string | null;
  instagram: string | null;
  isPaid: boolean;
  videos?: Video[];
};
