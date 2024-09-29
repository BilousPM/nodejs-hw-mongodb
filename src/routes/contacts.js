import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIDController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

const contactRouter = Router();

contactRouter.use('/:contactId', isValidId('contactId'));

contactRouter.get('/', ctrlWrapper(getAllContactsController));
contactRouter.get('/:contactId', ctrlWrapper(getContactByIDController));
contactRouter.post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactRouter.patch(
  '/:contactId',
  validateBody(updateContactSchema),
  ctrlWrapper(updateContactController),
);
contactRouter.delete('/:contactId', ctrlWrapper(deleteContactController));

export default contactRouter;
