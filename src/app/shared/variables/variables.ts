// Patterns
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import {faEyeSlash, faUser} from '@fortawesome/free-solid-svg-icons';
import {faSlidersH} from '@fortawesome/free-solid-svg-icons/faSlidersH';
import {faBoxOpen} from '@fortawesome/free-solid-svg-icons/faBoxOpen';
import {faSignOutAlt} from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import {faUnlockAlt} from '@fortawesome/free-solid-svg-icons/faUnlockAlt';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faEdit} from '@fortawesome/free-solid-svg-icons/faEdit';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import {faEllipsisH} from '@fortawesome/free-solid-svg-icons/faEllipsisH';
import {faSyncAlt} from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import {faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import {faEye} from '@fortawesome/free-solid-svg-icons/faEye';

export const regExps = {
  emailPattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};
// FontAwesome Icons
export const systemIcon = {
  itemIcon: faBoxOpen,
  logOutIcon: faSignOutAlt,
  userIcon: faUser,
  rmsIcon: faUnlockAlt,
  sliders: faSlidersH,
  errorForm: faExclamationTriangle,
  addIcon: faPlus,
  cancelIcon: faTimes,
  deleteIcon: faTrashAlt,
  editIcon: faEdit,
  infoIcon: faInfoCircle,
  dropdownIcon: faEllipsisH,
  refreshIcon: faSyncAlt,
  uploadIcon: faCloudUploadAlt,
  showIcon: faEye,
  hideIcon: faEyeSlash
};

