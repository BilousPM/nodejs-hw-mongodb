import { SORT_ORDER } from '../constants/index.js';
import { contactsModel } from '../db/models/contacts.js';
import { calculatePaginationDate } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
}) => {
  const skip = (page - 1) * perPage;

  const [count, contacts] = await Promise.all([
    contactsModel.countDocuments(),
    contactsModel
      .find()
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationDate(count, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = (contactId) => contactsModel.findById(contactId);

export const createContact = (contactData) => contactsModel.create(contactData);

export const updateContact = (contactId, contactData) =>
  contactsModel.findOneAndUpdate({ _id: contactId }, contactData, {
    new: true,
  });

export const deleteContactById = (contactId) =>
  contactsModel.findOneAndDelete({ _id: contactId });
