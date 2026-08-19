import { Request, Response, NextFunction } from 'express';
import Theme from '../models/Theme';
import Translation from '../models/Translation';

export const getThemes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const themes = await Theme.find();
    res.json({ success: true, data: themes, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getThemeByLang = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const theme = await Theme.findOne({ lang: req.params.lang });
    if (!theme) {
      const defaultTheme = await Theme.findOne({ lang: 'en' });
      return res.json({ success: true, data: defaultTheme, meta: null, error: null });
    }
    res.json({ success: true, data: theme, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const updateTheme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let theme = await Theme.findOne({ lang: req.params.lang });
    if (!theme) {
      theme = new Theme({ lang: req.params.lang, ...req.body });
    } else {
      Object.assign(theme, req.body);
    }
    await theme.save();
    res.json({ success: true, data: theme, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const getTranslationsByLang = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await Translation.find({ lang: req.params.lang });
    const dictionary: Record<string, string> = {};
    list.forEach(item => {
      dictionary[item.key] = item.value;
    });
    res.json({ success: true, data: dictionary, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};

export const updateTranslations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { translations } = req.body;
    if (!translations || typeof translations !== 'object') {
      return res.status(400).json({
        success: false,
        data: null,
        error: { code: 'INVALID_FORMAT', message: 'translations must be an object', field: 'translations' }
      });
    }

    for (const [key, value] of Object.entries(translations)) {
      await Translation.findOneAndUpdate(
        { lang: req.params.lang, key },
        { value: value as string },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, data: translations, meta: null, error: null });
  } catch (err) {
    next(err);
  }
};
