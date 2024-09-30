import createHttpError from 'http-errors';

import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import { parsedPaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsedPaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contactsData = await getAllContacts({
    page: +page,
    perPage: +perPage,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

export const getContactByIDController = async (req, res) => {
  const { contactId } = req.params;

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

export const createContactController = async (req, res) => {
  const newContact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const newContact = await updateContact(contactId, body);
  if (!newContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: newContact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactById(contactId);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).json({
    status: 200,
  });
};
