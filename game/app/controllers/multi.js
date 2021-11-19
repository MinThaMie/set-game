import Controller from '@ember/controller';
import { nanoid } from 'nanoid';

export default class MultiController extends Controller {
  get randomToken() {
    return nanoid();
  }
}
