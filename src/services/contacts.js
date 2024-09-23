import { contactsModel } from '../db/models/contacts.js';

export const getAllContacts = () => contactsModel.find();

export const getContactsById = async (contactId) =>
  contactsModel.findById(contactId);
