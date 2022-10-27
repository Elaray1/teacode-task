import Head from 'next/head';
import Link from 'next/link';
import { Center, Text } from '@mantine/core';

export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <Center style={{ height: '100vh' }}>
        <Link href="/contacts">
            <Text size={36} variant="link" color="orange">
              Go to contacts
            </Text>
        </Link>
      </Center>
    </>
  )
}
