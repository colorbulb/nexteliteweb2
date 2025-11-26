import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { Home } from './views/Home.jsx';
import { About } from './views/About.jsx';
import { Courses } from './views/Courses.jsx';
import { CourseDetails } from './views/CourseDetails.jsx';
import { Contact } from './views/Contact.jsx';
import { Enroll } from './views/Enroll.jsx';
import { Blog } from './views/Blog.jsx';
import { BlogPostView } from './views/BlogPost.jsx';
import { Admin } from './views/Admin.jsx';
import { Migrate } from './views/Migrate.jsx';
import { 
  INITIAL_COURSES, 
  INITIAL_BLOG_POSTS, 
  INITIAL_SOCIAL_FEED, 
  INITIAL_SETTINGS,
  TEAM,
  TESTIMONIALS,
  INITIAL_PAGE_CONTENT
} from './constants.js';
import {
  getCourses,
  getBlogPosts,
  getTeam,
  getTestimonials,
  getSettings,
  getPageContent,
  getSocialFeed,
  getLeads,
  saveCourse,
  saveBlogPost,
  deleteCourse as deleteCourseFromDB,
  deleteBlogPost as deleteBlogPostFromDB,
  saveTeam as saveTeamToDB,
  saveTestimonials as saveTestimonialsToDB,
  saveSettings as saveSettingsToDB,
  savePageContent as savePageContentToDB,
  saveSocialFeed as saveSocialFeedToDB,
  saveLead as saveLeadToDB,
  initializeFirestore
} from './firebase/db.js';
import { migrateToFirestore, forceMigrateToFirestore } from './firebase/migrate.js';

// Animated Background Component
const AnimatedBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
    {/* Geometric Shapes */}
    <div className="absolute top-10 left-10 text-blue-200 animate-float-slow">
      <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
    <div className="absolute top-1/4 right-20 text-indigo-100 animate-float-medium">
      <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor">
        <rect width="80" height="80" />
      </svg>
    </div>
    <div className="absolute bottom-1/3 left-1/4 text-amber-100 animate-float-slow delay-1000">
      <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor">
        <polygon points="50,15 90,85 10,85" />
      </svg>
    </div>
    <div className="absolute bottom-20 right-1/3 text-blue-100 animate-float-fast">
      <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
    <div className="absolute top-1/2 left-10 text-indigo-50 animate-drift">
      <svg width="150" height="150" viewBox="0 0 100 100" fill="currentColor">
         <path d="M10 10 H 90 V 90 H 10 L 10 10" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

const App = () => {
  // --- Global State (CMS Store) ---
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [blogPosts, setBlogPosts] = useState(INITIAL_BLOG_POSTS);
  const [socialFeed, setSocialFeed] = useState(INITIAL_SOCIAL_FEED);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [pageContent, setPageContent] = useState(INITIAL_PAGE_CONTENT);
  const [team, setTeam] = useState(TEAM);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Navigation State ---
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Load data from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Try to load from Firestore
        const [firestoreCourses, firestorePosts, firestoreTeam, firestoreTestimonials, 
                firestoreSettings, firestorePageContent, firestoreSocialFeed, firestoreLeads] = 
          await Promise.all([
            getCourses(),
            getBlogPosts(),
            getTeam(),
            getTestimonials(),
            getSettings(),
            getPageContent(),
            getSocialFeed(),
            getLeads()
          ]);

        // If Firestore has data, use it; otherwise initialize with constants.js
        if (firestoreCourses.length > 0) {
          // Firestore has data - use it
          setCourses(firestoreCourses);
          setBlogPosts(firestorePosts);
          setTeam(firestoreTeam);
          setTestimonials(firestoreTestimonials);
          setSocialFeed(firestoreSocialFeed);
          setLeads(firestoreLeads);
          
          // Settings and page content from Firestore
          if (firestoreSettings) {
            setSettings(firestoreSettings);
          }
          if (firestorePageContent) {
            setPageContent(firestorePageContent);
          }
        } else {
          // Firestore is empty - initialize with constants.js data
          console.log('Firestore is empty. Initializing with constants.js data...');
          await initializeFirestore({
            courses: INITIAL_COURSES,
            blogPosts: INITIAL_BLOG_POSTS,
            team: TEAM,
            testimonials: TESTIMONIALS,
            settings: INITIAL_SETTINGS,
            pageContent: INITIAL_PAGE_CONTENT,
            socialFeed: INITIAL_SOCIAL_FEED
          });
          
          // After initialization, reload from Firestore to get the saved data
          const [reloadedCourses, reloadedPosts, reloadedTeam, reloadedTestimonials, 
                  reloadedSettings, reloadedPageContent, reloadedSocialFeed] = 
            await Promise.all([
              getCourses(),
              getBlogPosts(),
              getTeam(),
              getTestimonials(),
              getSettings(),
              getPageContent(),
              getSocialFeed()
            ]);
          
          // Update state with Firestore data
          setCourses(reloadedCourses);
          setBlogPosts(reloadedPosts);
          setTeam(reloadedTeam);
          setTestimonials(reloadedTestimonials);
          setSocialFeed(reloadedSocialFeed);
          
          if (reloadedSettings) {
            setSettings(reloadedSettings);
          }
          if (reloadedPageContent) {
            setPageContent(reloadedPageContent);
          }
          
          console.log('✅ Firestore initialized and data loaded');
        }
      } catch (error) {
        console.error('Error loading data from Firestore:', error);
        // Fallback to constants.js data on error
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Handle hash-based routing for migration page
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#migrate') {
        setCurrentPage('migrate');
      }
    };
    
    handleHashChange(); // Check on mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page !== 'course-details') setSelectedCourseId(null);
    if (page !== 'blog-post') setSelectedPostId(null);
  };

  const handleViewCourse = (course) => {
    setSelectedCourseId(course.id);
    setCurrentPage('course-details');
  };

  const handleViewPost = (post) => {
    setSelectedPostId(post.id);
    setCurrentPage('blog-post');
  };

  const handleEnroll = (courseId) => {
    setSelectedCourseId(courseId);
    setCurrentPage('enroll');
  };

  // --- Data Management Functions (Passed to CMS) ---
  const addLead = async (leadData) => {
    const newLead = { 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString(), 
      ...leadData 
    };
    try {
      await saveLeadToDB(newLead);
      setLeads([newLead, ...leads]);
    } catch (error) {
      console.error('Error saving lead:', error);
      // Still update local state on error
      setLeads([newLead, ...leads]);
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    try {
      await saveSettingsToDB(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addCourse = async (courseData) => {
    try {
      const newCourse = {
        ...courseData,
        id: courseData.id || `course-${Date.now()}`,
        featured: courseData.featured || false,
        disabled: courseData.disabled || false
      };
      await saveCourse(newCourse);
      setCourses([...courses, newCourse]);
      return newCourse;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const updateCourse = async (courseData) => {
    try {
      await saveCourse(courseData);
      setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await deleteCourseFromDB(id);
      setCourses(courses.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
      // Still update local state on error
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const addBlogPost = async (postData) => {
    try {
      const newPost = {
        ...postData,
        id: postData.id || `post-${Date.now()}`,
        date: postData.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
      await saveBlogPost(newPost);
      setBlogPosts([...blogPosts, newPost]);
      return newPost;
    } catch (error) {
      console.error('Error adding blog post:', error);
      throw error;
    }
  };

  const updateBlogPost = async (postData) => {
    try {
      await saveBlogPost(postData);
      setBlogPosts(blogPosts.map(p => p.id === postData.id ? postData : p));
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  };

  const deleteBlogPost = async (id) => {
    try {
      await deleteBlogPostFromDB(id);
      setBlogPosts(blogPosts.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      // Still update local state on error
      setBlogPosts(blogPosts.filter(p => p.id !== id));
    }
  };
  
  const updatePageContent = async (page, key, value) => {
    const updated = {
      ...pageContent,
      [page]: {
        ...pageContent[page],
        [key]: value
      }
    };
    setPageContent(updated);
    try {
      await savePageContentToDB(updated);
    } catch (error) {
      console.error('Error saving page content:', error);
    }
  };

  const updateTeam = async (newTeam) => {
    setTeam(newTeam);
    try {
      await saveTeamToDB(newTeam);
    } catch (error) {
      console.error('Error saving team:', error);
    }
  };

  const updateTestimonials = async (newTestimonials) => {
    setTestimonials(newTestimonials);
    try {
      await saveTestimonialsToDB(newTestimonials);
    } catch (error) {
      console.error('Error saving testimonials:', error);
    }
  };

  const syncSocialMedia = async () => {
    const newPost = {
      id: Date.now().toString(),
      type: 'instagram',
      image: `https://picsum.photos/400/400?random=${Date.now()}`,
      caption: 'Synced content from Instagram API... #LiveUpdate',
      likes: 0
    };
    const updatedFeed = [newPost, ...socialFeed];
    setSocialFeed(updatedFeed);
    try {
      await saveSocialFeedToDB(updatedFeed);
    } catch (error) {
      console.error('Error saving social feed:', error);
    }
  };

  // --- Routing Logic ---
  const renderPage = () => {
    if (currentPage === 'admin') {
      return (
        <Admin 
          courses={courses}
          blogPosts={blogPosts}
          leads={leads}
          settings={settings}
          pageContent={pageContent}
          team={team}
          testimonials={testimonials}
          onUpdateSettings={updateSettings}
          onAddCourse={addCourse}
          onUpdateCourse={updateCourse}
          onDeleteCourse={deleteCourse}
          onAddBlogPost={addBlogPost}
          onUpdateBlogPost={updateBlogPost}
          onDeletePost={deleteBlogPost}
          onSyncSocial={syncSocialMedia}
          onUpdatePageContent={updatePageContent}
          onUpdateTeam={updateTeam}
          onUpdateTestimonials={updateTestimonials}
          onExit={() => handleNavigate('home')}
        />
      );
    }

    if (currentPage === 'migrate') {
      return <Migrate />;
    }

    // Public Pages
    switch (currentPage) {
      case 'home':
        return <Home 
          onNavigate={handleNavigate} 
          onViewCourse={handleViewCourse} 
          courses={courses} 
          content={pageContent.home}
          testimonials={testimonials}
        />;
      case 'about':
        return <About 
          content={pageContent.about} 
          team={team} 
        />;
      case 'courses':
        return <Courses onViewCourse={handleViewCourse} courses={courses} />;
      case 'course-details':
        const course = courses.find(c => c.id === selectedCourseId);
        if (!course) return <Courses onViewCourse={handleViewCourse} courses={courses} />;
        return <CourseDetails course={course} onNavigate={handleNavigate} onEnroll={handleEnroll} />;
      case 'blog':
        return <Blog onViewPost={handleViewPost} posts={blogPosts} socialFeed={socialFeed} />;
      case 'blog-post':
        const post = blogPosts.find(p => p.id === selectedPostId);
        if (!post) return <Blog onViewPost={handleViewPost} posts={blogPosts} socialFeed={socialFeed} />;
        return <BlogPostView post={post} onNavigate={handleNavigate} />;
      case 'contact':
        return <Contact onSubmitLead={addLead} settings={settings} content={pageContent.contact} />;
      case 'enroll':
        return <Enroll preselectedCourseId={selectedCourseId} onSubmitLead={addLead} courses={courses} />;
      default:
        return <Home onNavigate={handleNavigate} onViewCourse={handleViewCourse} courses={courses} content={pageContent.home} testimonials={testimonials} />;
    }
  };

  // Make migration functions available globally for console access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.migrateToFirestore = migrateToFirestore;
      window.forceMigrateToFirestore = forceMigrateToFirestore;
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-surface relative items-center justify-center">
        <div className="text-xl font-bold text-slate-700">Loading from Firestore...</div>
        <div className="text-sm text-slate-500 mt-2">If this is your first time, data is being migrated from constants.js</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-surface relative">
      {/* Background Animation Layer */}
      {currentPage !== 'admin' && <AnimatedBackground />}

      {currentPage !== 'admin' && (
        <Header 
          currentPage={currentPage} 
          onNavigate={handleNavigate} 
          settings={settings}
        />
      )}
      
      <main className="flex-grow flex flex-col items-center justify-start w-full z-10">
        {renderPage()}
      </main>

      {currentPage !== 'admin' && (
        <Footer 
          onNavigate={handleNavigate} 
          settings={settings}
        />
      )}
    </div>
  );
};

export default App;
