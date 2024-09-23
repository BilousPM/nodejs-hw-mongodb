import { Router } from 'express';
import {
  createContactController,
  getAllContactsController,
  getContactByIDController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getAllContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIDController));
contactRouter.post('/', ctrlWrapper(createContactController));

export default contactRouter;
