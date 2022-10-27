import { useEffect, useState, useMemo, useCallback } from 'react';
import Head from 'next/head'
import { Center, Input, Loader, Text, Box, Group, Avatar, Checkbox } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { useDebouncedValue } from '@mantine/hooks';

import { getContacts } from './api';

const EmptyView = () => <Text>No Data</Text>

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const [debouncedSearchValue] = useDebouncedValue(searchValue, 500);

  const onContactClick = useCallback((contactId) => {
    const allSelectedContactIds = [];

    setContacts(contacts.map((contact) => {
      if (contact.id === contactId) {
        contact.checked = !contact.checked;
      }

      if (contact.checked) {
        allSelectedContactIds.push(contact.id);
      }

      return contact;
    }));

    console.log('allSelectedContactIds: ', allSelectedContactIds);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    if (!debouncedSearchValue) {
      return contacts;
    }
  
    return contacts.filter((contact) => {
      const fullName = `${contact.first_name} ${contact.last_name}`;
  
      return fullName.toLowerCase().includes(debouncedSearchValue.toLowerCase());
    });
  }, [debouncedSearchValue, contacts]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const fetchedContacts = await getContacts();
  
        setContacts(fetchedContacts.map((contact) => ({ ...contact, checked: false })));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContacts();
  }, []);

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="orange" size="lg" />
      </Center>
    );
  }

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>

      <Center>
        <Box>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            variant="filled"
            placeholder="Egor Emelyanov"
            icon={<IconSearch />}
            radius="md"
            size="lg"
            mt={30}
          />
          {filteredContacts.length ?
            <Box>
              {filteredContacts.map((contact) => (
                <Group
                  key={contact.id}
                  mt={20}
                  onClick={() => onContactClick(contact.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Avatar src={contact.avatar} radius="xl" size="lg" alt="avatar" />

                  <Text>{contact.first_name} {contact.last_name}</Text>

                  <Checkbox
                    checked={contact.checked}
                    color="orange"
                    radius="xl"
                    size="md"
                  />
                </Group>
              ))}
            </Box>
            : <EmptyView />}
        </Box>
      </Center>
    </>
  )
}
