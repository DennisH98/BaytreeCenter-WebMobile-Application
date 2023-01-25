import { MentorAccount } from "../models/MentorAccount";

function randomNumberWithNDigits(n: number): number {
  let minNumber: number = Math.pow(10, n-1);
  return Math.floor(minNumber + (Math.random() * (9 * minNumber)));
}

export async function generateUsername(firstName: string, lastName: string): Promise<string> {
  let newUsername: string = "";
  let usernameTaken: boolean = true;

  while (usernameTaken) {
    newUsername = firstName[0].toLowerCase() + lastName.toLowerCase() + randomNumberWithNDigits(5);

    let accountsWithUsername = await MentorAccount.find({ username: newUsername });
    if (accountsWithUsername.length === 0) {
      usernameTaken = false;
    }
  }

  return newUsername;
}
