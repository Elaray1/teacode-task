export async function getContacts() {
  const res = await fetch('https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json');

  return res.json();
}