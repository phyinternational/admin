// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOT_DASHBOARD = '/dashboard';
const ROOT_PATIENT = '/patient';
const ROOT_ADMIN = '/admin';
const ROOT_DOCTOR_DASHBOARD = '/dashboard/doctor';
const ROOT_USER_MENU = '/user';
const ROOT_DOCTOR = '/doctor';
const ROOT_APPOINTMENT = '/appointment';
const ROOT_MEETING = '/meeting';
const ROOT_ABOUT = '/about';
const ROOT_GROW = '/grow';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  signup: '/signup',
  forgotPassword: 'forgot-password',
  checkEmail: 'check-email',
  newPassword: 'new-password',
  passwordReset: 'password-reset',
  emailVerified: 'email-verified',
  verifyEmail: '/verify-email',
};

export const PATH_DASHBOARD = {
  root: ROOT_DASHBOARD,
  one: path(ROOT_DASHBOARD, '/one'),
  two: path(ROOT_DASHBOARD, '/two'),
  three: path(ROOT_DASHBOARD, '/three'),
  user: {
    root: path(ROOT_DASHBOARD, '/user'),
    four: path(ROOT_DASHBOARD, '/user/four'),
    five: path(ROOT_DASHBOARD, '/user/five'),
    six: path(ROOT_DASHBOARD, '/user/six'),
  },
};

export const PATH_PATIENT = {
  root: ROOT_PATIENT,
  home: path(ROOT_PATIENT, '/home'),
  appointments: path(ROOT_PATIENT, '/appointment'),
  upcomingAppointment: path(ROOT_PATIENT, '/upcoming-appointment'),
  pastAppointment: path(ROOT_PATIENT, '/past-appointment'),
  video: path(ROOT_PATIENT, '/video'),
};

export const PATH_ADMIN = {
  root: ROOT_ADMIN,
  doctors: path(ROOT_ADMIN, '/doctors'),
  doctorProfile: path(ROOT_ADMIN, '/doctors/:id'),
};
export const PATH_DOCTOR = {
  root: ROOT_DOCTOR,
  home: path(ROOT_DOCTOR, '/:slug'),
};

export const PATH_APPOINTMENT = {
  root: ROOT_APPOINTMENT,
  book: path(ROOT_APPOINTMENT, '/book'),
  confirm: path(ROOT_APPOINTMENT, '/confirm'),
  patientInfo: path(ROOT_APPOINTMENT, '/patient-info'),
  feedback: path(ROOT_APPOINTMENT, '/feedback'),
};

export const PATH_DOCTOR_DASHBOARD = {
  root: ROOT_DOCTOR_DASHBOARD,
  home: path(ROOT_APPOINTMENT, '/home'),
};

export const PATH_MEETING = {
  root: ROOT_MEETING,
};

export const PATH_USERMENU = {
  root: ROOT_USER_MENU,
  profile: path(ROOT_USER_MENU, '/profile'),
  password: path(ROOT_USER_MENU, '/login-and-password'),
  subscriptionCenter: path(ROOT_USER_MENU, '/subscription-center'),
  permissionManagment: path(ROOT_USER_MENU, '/permission-management'),
  privacy: path(ROOT_USER_MENU, '/privacy'),
};

export const PATH_ABOUT = {
  root: ROOT_ABOUT,
  join: path(ROOT_ABOUT, '/join'),
};

export const PATH_GROW = {
  root: ROOT_GROW,
  signup: path(ROOT_GROW, '/signup'),
  onboarding: path(ROOT_GROW, '/onboarding'),
  thankyou: path(ROOT_GROW, '/thank-you'),
  setup: path(ROOT_GROW, '/setup'),
};
