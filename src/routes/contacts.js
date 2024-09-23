import { Router } from 'express';
import {
  getAllContactsController,
  getContactByIDController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(getAllContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIDController));

export default contactRouter;
