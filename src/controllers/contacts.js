import createHttpError from 'http-errors';

import { getAllContacts, getContactsById } from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const dataContacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: dataContacts,
  });
};

export const getContactByIDController = async (req, res, next) => {
  const contactId = req.params.contactId;

  const contact = await getContactsById(contactId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: ` Successfully found contact with id ${contactId}!,`,
    data: contact,
  });
};
