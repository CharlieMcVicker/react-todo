import firebase from "firebase";


export type WithId<T> = T & { id: string };

export interface TodoData {
  title: string;
  details: string;
  dueDate: firebase.firestore.Timestamp;
  complete: boolean;
}
