import { contactsModel } from '../db/models/contacts.js';

export const getAllContacts = () => contactsModel.find();

export const getContactsById = (contactId) => contactsModel.findById(contactId);

export const createContact = (contactData) => contactsModel.create(contactData);

export const updateContact = (contactId, contactData) =>
  contactsModel.findOneAndUpdate({ _id: contactId }, contactData, {
    new: true,
  });

export const deleteContactById = (contactId) =>
  contactsModel.findOneAndDelete({ _id: contactId });
