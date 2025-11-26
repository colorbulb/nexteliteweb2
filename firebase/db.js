// Firestore database service functions
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./config.js";

// Collection names
const COLLECTIONS = {
  COURSES: 'courses',
  BLOG_POSTS: 'blogPosts',
  TEAM: 'team',
  TESTIMONIALS: 'testimonials',
  SETTINGS: 'settings',
  PAGE_CONTENT: 'pageContent',
  SOCIAL_FEED: 'socialFeed',
  LEADS: 'leads'
};

// ===== COURSES =====
export const getCourses = async () => {
  try {
    const coursesRef = collection(db, COLLECTIONS.COURSES);
    const snapshot = await getDocs(coursesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const saveCourse = async (course) => {
  try {
    if (course.id) {
      await setDoc(doc(db, COLLECTIONS.COURSES, course.id), course);
      return course.id;
    } else {
      const { id, ...courseData } = course;
      const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), courseData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const saveAllCourses = async (courses) => {
  try {
    const batch = courses.map(course => 
      setDoc(doc(db, COLLECTIONS.COURSES, course.id), course)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving all courses:', error);
    throw error;
  }
};

// ===== BLOG POSTS =====
export const getBlogPosts = async () => {
  try {
    const postsRef = collection(db, COLLECTIONS.BLOG_POSTS);
    const snapshot = await getDocs(postsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
};

export const saveBlogPost = async (post) => {
  try {
    if (post.id) {
      await setDoc(doc(db, COLLECTIONS.BLOG_POSTS, post.id), post);
      return post.id;
    } else {
      const { id, ...postData } = post;
      const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_POSTS), postData);
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving blog post:', error);
    throw error;
  }
};

export const deleteBlogPost = async (postId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, postId));
  } catch (error) {
    console.error('Error deleting blog post:', error);
    throw error;
  }
};

export const saveAllBlogPosts = async (posts) => {
  try {
    const batch = posts.map(post => 
      setDoc(doc(db, COLLECTIONS.BLOG_POSTS, post.id), post)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving all blog posts:', error);
    throw error;
  }
};

// ===== TEAM =====
export const getTeam = async () => {
  try {
    const teamRef = collection(db, COLLECTIONS.TEAM);
    const snapshot = await getDocs(teamRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
};

export const saveTeam = async (team) => {
  try {
    // Delete all existing team members
    const existingTeam = await getTeam();
    await Promise.all(existingTeam.map(member => 
      deleteDoc(doc(db, COLLECTIONS.TEAM, member.id))
    ));
    
    // Save all team members
    const batch = team.map(member => 
      setDoc(doc(db, COLLECTIONS.TEAM, member.id), member)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving team:', error);
    throw error;
  }
};

// ===== TESTIMONIALS =====
export const getTestimonials = async () => {
  try {
    const testimonialsRef = collection(db, COLLECTIONS.TESTIMONIALS);
    const snapshot = await getDocs(testimonialsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
};

export const saveTestimonials = async (testimonials) => {
  try {
    // Delete all existing testimonials
    const existingTestimonials = await getTestimonials();
    await Promise.all(existingTestimonials.map(testimonial => 
      deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id))
    ));
    
    // Save all testimonials
    const batch = testimonials.map(testimonial => 
      setDoc(doc(db, COLLECTIONS.TESTIMONIALS, testimonial.id), testimonial)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving testimonials:', error);
    throw error;
  }
};

// ===== SETTINGS =====
export const getSettings = async () => {
  try {
    const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'main');
    const snapshot = await getDoc(settingsRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const saveSettings = async (settings) => {
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'main'), settings);
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// ===== PAGE CONTENT =====
export const getPageContent = async () => {
  try {
    const pageContentRef = doc(db, COLLECTIONS.PAGE_CONTENT, 'main');
    const snapshot = await getDoc(pageContentRef);
    if (snapshot.exists()) {
      return snapshot.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

export const savePageContent = async (pageContent) => {
  try {
    await setDoc(doc(db, COLLECTIONS.PAGE_CONTENT, 'main'), pageContent);
  } catch (error) {
    console.error('Error saving page content:', error);
    throw error;
  }
};

// ===== SOCIAL FEED =====
export const getSocialFeed = async () => {
  try {
    const feedRef = collection(db, COLLECTIONS.SOCIAL_FEED);
    const snapshot = await getDocs(feedRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching social feed:', error);
    return [];
  }
};

export const saveSocialFeed = async (feed) => {
  try {
    // Delete all existing feed items
    const existingFeed = await getSocialFeed();
    await Promise.all(existingFeed.map(item => 
      deleteDoc(doc(db, COLLECTIONS.SOCIAL_FEED, item.id))
    ));
    
    // Save all feed items
    const batch = feed.map(item => 
      setDoc(doc(db, COLLECTIONS.SOCIAL_FEED, item.id), item)
    );
    await Promise.all(batch);
  } catch (error) {
    console.error('Error saving social feed:', error);
    throw error;
  }
};

// ===== LEADS =====
export const getLeads = async () => {
  try {
    const leadsRef = collection(db, COLLECTIONS.LEADS);
    const snapshot = await getDocs(leadsRef);
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort by date descending (most recent first)
    return leads.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
};

export const saveLead = async (lead) => {
  try {
    const { id, ...leadData } = lead;
    const docRef = await addDoc(collection(db, COLLECTIONS.LEADS), leadData);
    return docRef.id;
  } catch (error) {
    console.error('Error saving lead:', error);
    throw error;
  }
};

// ===== INITIALIZE DATA (Migration from constants.js) =====
export const initializeFirestore = async (initialData) => {
  try {
    // Check if data already exists
    const existingCourses = await getCourses();
    if (existingCourses.length > 0) {
      console.log('Firestore already has data, skipping initialization');
      return false;
    }

    // Initialize all collections
    await saveAllCourses(initialData.courses || []);
    await saveAllBlogPosts(initialData.blogPosts || []);
    await saveTeam(initialData.team || []);
    await saveTestimonials(initialData.testimonials || []);
    await saveSettings(initialData.settings || {});
    await savePageContent(initialData.pageContent || {});
    await saveSocialFeed(initialData.socialFeed || []);

    console.log('Firestore initialized with initial data');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

