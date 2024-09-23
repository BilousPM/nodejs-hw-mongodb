import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIDController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getAllContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIDController));
contactRouter.post('/', ctrlWrapper(createContactController));
contactRouter.patch('/:contactId', ctrlWrapper(updateContactController));
contactRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

export default contactRouter;
