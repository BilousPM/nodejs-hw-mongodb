import { contactsModel } from '../db/models/contacts.js';

export const getAllContacts = () => contactsModel.find();

export const getContactsById = (contactId) => contactsModel.findById(contactId);

export const createContact = (dataContact) => contactsModel.create(dataContact);
