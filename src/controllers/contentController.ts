import { Request, Response, NextFunction } from 'express';
import {
  Department,
  Project,
  Event,
  Testimonial,
  Team,
  Donor,
  ImpactStory,
  AnnualReport,
  Service,
  News,
  Gallery,
  Application
} from '../models';

// ==========================================
// Departments
// ==========================================
export const getDepartments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await Department.find().sort({ order: 1 });
    res.json({ success: true, data: departments, meta: { total: departments.length }, error: null });
  } catch (err) { next(err); }
};

export const getDepartmentBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findOne({ slug: req.params.slug });
    if (!dept) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Department not found', field: 'slug' }
      });
    }
    res.json({ success: true, data: dept, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json({ success: true, data: dept, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: dept, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Department deleted successfully' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Projects
// ==========================================
export const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const filter: Record<string, any> = {};
    if (category) filter.category = category;

    const projects = await Project.find(filter);
    res.json({ success: true, data: projects, meta: { total: projects.length }, error: null });
  } catch (err) { next(err); }
};

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: project, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Project deleted successfully' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Events
// ==========================================
export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({ success: true, data: events, meta: { total: events.length }, error: null });
  } catch (err) { next(err); }
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ success: true, data: event, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: event, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Event deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Impact Stories
// ==========================================
export const getImpactStories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stories = await ImpactStory.find().sort({ date: -1 });
    res.json({ success: true, data: stories, meta: { total: stories.length }, error: null });
  } catch (err) { next(err); }
};

export const getImpactStoryBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const story = await ImpactStory.findOne({ slug: req.params.slug });
    if (!story) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Impact story not found', field: 'slug' }
      });
    }
    res.json({ success: true, data: story, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createImpactStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const story = new ImpactStory(req.body);
    await story.save();
    res.status(201).json({ success: true, data: story, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateImpactStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const story = await ImpactStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: story, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteImpactStory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await ImpactStory.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Impact story deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Testimonials, Team, Donors
// ==========================================
// Testimonials
export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Testimonial.find();
    res.json({ success: true, data: items, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Testimonial(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteTestimonial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Testimonial deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// Team
export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Team.find();
    res.json({ success: true, data: items, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Team(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Team member deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// Donors
export const getDonors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Donor.find();
    res.json({ success: true, data: items, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Donor(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteDonor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Donor.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Donor deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// Annual Reports
export const getAnnualReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await AnnualReport.find().sort({ year: -1 });
    res.json({ success: true, data: items, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createAnnualReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new AnnualReport(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateAnnualReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await AnnualReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteAnnualReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await AnnualReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Annual report deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ── Services ──────────────────────────────────────────────────────────────
export const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Service.find().sort({ order: 1, _id: 1 });
    res.json({ success: true, data: items, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Service(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Service deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// News
// ==========================================
export const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, lang } = req.query;
    const filter: Record<string, any> = {};
    if (category) filter.category = category;
    const langCode = lang as string | undefined;
    if (langCode && langCode !== '') {
      if (langCode === 'en') {
        // include older docs that have no language field (backward compat)
        filter.$or = [{ language: 'en' }, { language: { $exists: false } }, { language: '' }];
      } else {
        filter.language = langCode;
      }
    }
    // no lang param → return all (used by admin panel)
    const items = await News.find(filter).sort({ publishedAt: -1 });
    res.json({ success: true, data: items, meta: { total: items.length }, error: null });
  } catch (err) { next(err); }
};

export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'News item not found', field: 'id' }
      });
    }
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new News(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'News item deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Gallery
// ==========================================
export const getGallery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Gallery.find().sort({ order: 1 });
    res.json({ success: true, data: items, meta: { total: items.length }, error: null });
  } catch (err) { next(err); }
};

export const createGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Gallery(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteGalleryItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Gallery item deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};

// ==========================================
// Applications
// ==========================================
export const getApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Application.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data: items, meta: { total: items.length }, error: null });
  } catch (err) { next(err); }
};

export const createApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = new Application(req.body);
    await item.save();
    res.status(201).json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const updateApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item, meta: null, error: null });
  } catch (err) { next(err); }
};

export const deleteApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: { message: 'Application deleted' }, meta: null, error: null });
  } catch (err) { next(err); }
};
