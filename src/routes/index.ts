import { Router } from 'express';
import multer from 'multer';
import { login } from '../controllers/authController';
import {
  getAdmins,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser
} from '../controllers/adminUserController';
import { getConfig, updateConfig } from '../controllers/configController';
import { getYoutubeVideos, updateYoutubeConfig } from '../controllers/youtubeController';
import {
  getThemes,
  getThemeByLang,
  updateTheme,
  getTranslationsByLang,
  updateTranslations
} from '../controllers/themeController';
import {
  getDepartments,
  getDepartmentBySlug,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getImpactStories,
  getImpactStoryBySlug,
  createImpactStory,
  updateImpactStory,
  deleteImpactStory,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getDonors,
  createDonor,
  updateDonor,
  deleteDonor,
  getAnnualReports,
  createAnnualReport,
  updateAnnualReport,
  deleteAnnualReport,
  getServices,
  createService,
  updateService,
  deleteService,
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controllers/contentController';
import {
  submitVolunteer,
  getVolunteers,
  deleteVolunteer,
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
  submitSubscription,
  getSubscriptions,
  deleteSubscription,
  submitMember,
  getMembers,
  deleteMember,
  updateMemberStatus
} from '../controllers/formController';
import { uploadImage } from '../controllers/uploadController';
import { sendNotification } from '../controllers/notificationController';
import { getSocialFeed } from '../controllers/socialFeedController';

const router = Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Basic Admin Auth Middleware (Token check)
const adminAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'No bearer token provided', field: null }
    });
  }
  const token = authHeader.split(' ')[1];
  if (token !== 'abhina-admin-token-secret-2026') {
    return res.status(403).json({
      success: false,
      data: null,
      error: { code: 'FORBIDDEN', message: 'Invalid administration token', field: null }
    });
  }
  next();
};

// ==========================================
// Module 1: Authentication
// ==========================================
router.post('/auth/login', login);

// ==========================================
// Module 2: Configuration
// ==========================================
router.get('/config', getConfig);
router.put('/admin/config', adminAuth, updateConfig);
router.get('/youtube-videos', getYoutubeVideos);
router.put('/admin/youtube-config', adminAuth, updateYoutubeConfig);
router.get('/social-feed', getSocialFeed);

// ==========================================
// Module 3: Themes & Translations
// ==========================================
router.get('/themes', getThemes);
router.get('/themes/:lang', getThemeByLang);
router.put('/admin/themes/:lang', adminAuth, updateTheme);
router.get('/translations/:lang', getTranslationsByLang);
router.put('/admin/translations/:lang', adminAuth, updateTranslations);

// ==========================================
// Module 4: Departments (also aliased as /our-work for frontend)
// ==========================================
router.get('/departments', getDepartments);
router.get('/departments/:slug', getDepartmentBySlug);
router.get('/our-work', getDepartments);
router.get('/our-work/:slug', getDepartmentBySlug);
router.post('/admin/departments', adminAuth, createDepartment);
router.put('/admin/departments/:id', adminAuth, updateDepartment);
router.delete('/admin/departments/:id', adminAuth, deleteDepartment);
router.post('/admin/our-work', adminAuth, createDepartment);
router.put('/admin/our-work/:id', adminAuth, updateDepartment);
router.delete('/admin/our-work/:id', adminAuth, deleteDepartment);

// ==========================================
// Module 5: Projects
// ==========================================
router.get('/projects', getProjects);
router.post('/admin/projects', adminAuth, createProject);
router.put('/admin/projects/:id', adminAuth, updateProject);
router.delete('/admin/projects/:id', adminAuth, deleteProject);

// ==========================================
// Module 6: Events
// ==========================================
router.get('/events', getEvents);
router.post('/admin/events', adminAuth, createEvent);
router.put('/admin/events/:id', adminAuth, updateEvent);
router.delete('/admin/events/:id', adminAuth, deleteEvent);

// ==========================================
// Module 7: Impact Stories
// ==========================================
router.get('/impact-stories', getImpactStories);
router.get('/impact-stories/:slug', getImpactStoryBySlug);
router.post('/admin/impact-stories', adminAuth, createImpactStory);
router.put('/admin/impact-stories/:id', adminAuth, updateImpactStory);
router.delete('/admin/impact-stories/:id', adminAuth, deleteImpactStory);

// ==========================================
// Module 8: Testimonials
// ==========================================
router.get('/testimonials', getTestimonials);
router.post('/admin/testimonials', adminAuth, createTestimonial);
router.put('/admin/testimonials/:id', adminAuth, updateTestimonial);
router.delete('/admin/testimonials/:id', adminAuth, deleteTestimonial);

// ==========================================
// Module 9: Team Members
// ==========================================
router.get('/team', getTeam);
router.post('/admin/team', adminAuth, createTeamMember);
router.put('/admin/team/:id', adminAuth, updateTeamMember);
router.delete('/admin/team/:id', adminAuth, deleteTeamMember);

// ==========================================
// Module 10: Donors
// ==========================================
router.get('/donors', getDonors);
router.post('/admin/donors', adminAuth, createDonor);
router.put('/admin/donors/:id', adminAuth, updateDonor);
router.delete('/admin/donors/:id', adminAuth, deleteDonor);

// ==========================================
// Module 11: Forms Submissions
// ==========================================
router.post('/volunteers', submitVolunteer);
router.get('/admin/volunteers', adminAuth, getVolunteers);
router.delete('/admin/volunteers/:id', adminAuth, deleteVolunteer);

router.post('/contact/messages', submitContactMessage);
router.get('/admin/contact/messages', adminAuth, getContactMessages);
router.delete('/admin/contact/messages/:id', adminAuth, deleteContactMessage);

router.post('/subscriptions', submitSubscription);
router.get('/admin/subscriptions', adminAuth, getSubscriptions);
router.delete('/admin/subscriptions/:id', adminAuth, deleteSubscription);

// ==========================================
// Module 11b: Annual Reports
// ==========================================
router.get('/annual-reports', getAnnualReports);
router.post('/admin/annual-reports', adminAuth, createAnnualReport);
router.put('/admin/annual-reports/:id', adminAuth, updateAnnualReport);
router.delete('/admin/annual-reports/:id', adminAuth, deleteAnnualReport);

// ==========================================
// Module 11c: Services (home-page "Our Services" — fully dynamic)
// ==========================================
router.get('/services', getServices);
router.post('/admin/services', adminAuth, createService);
router.put('/admin/services/:id', adminAuth, updateService);
router.delete('/admin/services/:id', adminAuth, deleteService);

// ==========================================
// Module 11d: News
// ==========================================
router.get('/news', getNews);
router.get('/news/:id', getNewsById);
router.post('/admin/news', adminAuth, createNews);
router.put('/admin/news/:id', adminAuth, updateNews);
router.delete('/admin/news/:id', adminAuth, deleteNews);

// ==========================================
// Module 11e: Gallery
// ==========================================
router.get('/gallery', getGallery);
router.post('/admin/gallery', adminAuth, createGalleryItem);
router.put('/admin/gallery/:id', adminAuth, updateGalleryItem);
router.delete('/admin/gallery/:id', adminAuth, deleteGalleryItem);

// ==========================================
// Module 11f: Applications
// ==========================================
router.get('/applications', getApplications);
router.post('/admin/applications', adminAuth, createApplication);
router.put('/admin/applications/:id', adminAuth, updateApplication);
router.delete('/admin/applications/:id', adminAuth, deleteApplication);

// ==========================================
// Module 11g: Members
// ==========================================
router.post('/members', submitMember);
router.get('/admin/members', adminAuth, getMembers);
router.put('/admin/members/:id', adminAuth, updateMemberStatus);
router.delete('/admin/members/:id', adminAuth, deleteMember);

// ==========================================
// Module 12: Admin Users (credentials management)
// ==========================================
router.get('/admin/admins', adminAuth, getAdmins);
router.post('/admin/admins', adminAuth, createAdminUser);
router.put('/admin/admins/:id', adminAuth, updateAdminUser);
router.delete('/admin/admins/:id', adminAuth, deleteAdminUser);

// ==========================================
// Module 13: Image Upload
// ==========================================
router.post('/admin/upload', adminAuth, upload.single('file'), uploadImage);

// ==========================================
// Module 15: Push Notifications
// ==========================================
router.post('/admin/notifications/send', adminAuth, sendNotification);

// ==========================================
// Module 14: Static Regions Lookup
// ==========================================
router.get('/regions', (req, res) => {
  const regions = [
    { id: 'tg-hyd-habsiguda', name: 'Habsiguda, Hyderabad', state: 'Telangana' },
    { id: 'tg-hyd-uppal', name: 'Uppal, Hyderabad', state: 'Telangana' },
    { id: 'tg-hyd-kothapet', name: 'Kothapet, Hyderabad', state: 'Telangana' },
    { id: 'tg-hyd-secunderabad', name: 'Secunderabad, Hyderabad', state: 'Telangana' },
    { id: 'tg-rr-hayathnagar', name: 'Hayathnagar, Ranga Reddy', state: 'Telangana' },
    { id: 'tg-rr-ibrahimpatnam', name: 'Ibrahimpatnam, Ranga Reddy', state: 'Telangana' },
    { id: 'ap-vsp-vizag', name: 'Visakhapatnam Urban', state: 'Andhra Pradesh' },
    { id: 'ap-gnt-vijayawada', name: 'Vijayawada Central', state: 'Andhra Pradesh' }
  ];
  res.json({ success: true, data: regions, meta: null, error: null });
});

export default router;
