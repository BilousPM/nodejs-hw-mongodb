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
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveImage } from '../utils/saveImage.js';

// ---- Get all contacts
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsedPaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contactsData = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactsData,
  });
};

// ---- Get contact by Id
export const getContactByIDController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactsById(contactId, req.user._id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: ` Successfully found contact with id ${contactId} !`,
    data: contact,
  });
};

// ---- Create contact
export const createContactController = async (req, res) => {
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveImage(photo);
  }
  const newContact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// ---- Update contact
export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveImage(photo);
  }
  const newContact = await updateContact(
    contactId,
    { ...body, photo: photoUrl },
    req.user._id,
  );
  if (!newContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: newContact,
  });
};

// ---- Delete contact
export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const deletedContact = await deleteContactById(contactId, req.user._id);
  if (!deletedContact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).json({
    status: 204,
  });
};
