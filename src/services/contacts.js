import { contactsModel } from '../db/models/contacts.js';

const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

const getContactsById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export default {
  getAllContacts,
  getContactsById,
};
