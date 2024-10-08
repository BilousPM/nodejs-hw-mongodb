import { SORT_ORDER } from '../constants/index.js';
import { contactsModel } from '../db/models/contacts.js';
import { calculatePaginationDate } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
  userId,
}) => {
  const skip = (page - 1) * perPage;

  const contactQuery = contactsModel.find({ userId });

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite || filter.isFavourite === false) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [count, contacts] = await Promise.all([
    contactsModel.find().merge(contactQuery).countDocuments(),
    contactsModel
      .find()
      .merge(contactQuery)
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

export const getContactsById = (contactId, userId) =>
  contactsModel.findOne({ _id: contactId, userId });

export const createContact = (contactData) => contactsModel.create(contactData);

export const updateContact = (contactId, contactData, userId) =>
  contactsModel.findOneAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });

export const deleteContactById = (contactId, userId) =>
  contactsModel.findOneAndDelete({ _id: contactId, userId });
