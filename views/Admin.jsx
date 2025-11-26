import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Users, Settings, LogOut, Database, RefreshCw, Trash2, Plus, Download, Type, Star, Edit, X, Save, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config.js';
import { CourseEditor } from './CourseEditor.jsx';
import { BlogEditor } from './BlogEditor.jsx';
import { ListManager } from './ListManager.jsx';
import { AnnouncementEditor } from './AnnouncementEditor.jsx';
import { ComponentTest } from './ComponentTest.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Container, 
  Row, 
  Col, 
  Nav, 
  NavItem, 
  NavLink, 
  Card, 
  CardBody, 
  CardHeader,
  Table,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';

export const Admin = ({ 
  courses, 
  blogPosts, 
  leads, 
  settings,
  pageContent,
  team,
  testimonials,
  onUpdateSettings, 
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse, 
  onAddBlogPost,
  onUpdateBlogPost,
  onDeletePost, 
  onSyncSocial,
  onUpdatePageContent,
  onUpdateTeam,
  onUpdateTestimonials,
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onExit 
}) => {
  const [view, setView] = useState('login'); // login, dashboard, content, pages, team, leads, settings, lists
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  
  // Modal states
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Listen for auth state changes and handle admin routing
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check URL for admin sub-routes
        const path = window.location.pathname;
        if (path.startsWith('/admin/')) {
          const subRoute = path.split('/admin/')[1];
          if (subRoute && ['dashboard', 'content', 'pages', 'team', 'leads', 'announcements', 'settings', 'lists', 'components'].includes(subRoute)) {
            setView(subRoute);
          } else {
            setView('dashboard');
          }
        } else {
          setView('dashboard');
        }
      } else {
        setUser(null);
        setView('login');
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle admin sub-route changes
  useEffect(() => {
    const handlePopState = () => {
      if (user) {
        const path = window.location.pathname;
        if (path.startsWith('/admin/')) {
          const subRoute = path.split('/admin/')[1];
          if (subRoute && ['dashboard', 'content', 'pages', 'team', 'leads', 'announcements', 'settings', 'lists', 'components'].includes(subRoute)) {
            setView(subRoute);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user]);

  // Update URL when view changes in admin
  useEffect(() => {
    if (user && view !== 'login') {
      const adminPath = `/admin/${view}`;
      if (window.location.pathname !== adminPath) {
        window.history.pushState({ view }, '', adminPath);
      }
    }
  }, [view, user]);

  // --- Auth ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle navigation
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('login');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Course editor handlers
  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        await onUpdateCourse(courseData);
      } else {
        await onAddCourse(courseData);
      }
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Error saving course: ' + error.message);
    }
  };

  // Blog editor handlers
  const handleAddBlogPost = () => {
    setEditingBlog(null);
    setShowBlogModal(true);
  };

  const handleEditBlogPost = (post) => {
    setEditingBlog(post);
    setShowBlogModal(true);
  };

  const handleSaveBlogPost = async (postData) => {
    try {
      if (editingBlog) {
        await onUpdateBlogPost(postData);
      } else {
        await onAddBlogPost(postData);
      }
      setShowBlogModal(false);
      setEditingBlog(null);
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('Error saving blog post: ' + error.message);
    }
  };

  // Announcement handlers
  const handleSaveAnnouncement = async (announcementData) => {
    try {
      if (announcementData.id) {
        await onUpdateAnnouncement(announcementData);
      } else {
        await onAddAnnouncement(announcementData);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      throw error;
    }
  };

  // --- Firebase Export ---
  const handleExport = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      courses,
      blogPosts,
      settings,
      pageContent,
      team,
      testimonials,
      leads
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "firebase_import_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- Helper for Page Content Forms ---
  const renderContentInputs = (pageName, data) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-1 capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        {value.length > 50 ? (
          <textarea
            value={value}
            onChange={(e) => onUpdatePageContent(pageName, key, e.target.value)}
            className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary h-24"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onUpdatePageContent(pageName, key, e.target.value)}
            className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
          />
        )}
      </div>
    ));
  };

  // --- Render Login ---
  if (view === 'login' || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">CMS Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={onExit} className="w-full text-slate-500 text-sm hover:underline">
              Back to Website
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- CMS Layout ---
  return (
    <Container fluid className="p-0 min-vh-100">
      <Row className="g-0">
        {/* Sidebar - Responsive */}
        <Col 
          xs={12} 
          md={3} 
          lg={2} 
          className={`bg-dark text-white d-flex flex-column position-fixed h-100 overflow-auto ${sidebarOpen ? 'd-block' : 'd-none d-md-block'}`}
          style={{ zIndex: 1000 }}
        >
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 fw-bold">Nexus CMS</h5>
                <small className="text-muted">Admin Control Panel</small>
              </div>
              <Button 
                close 
                className="d-md-none text-white" 
                onClick={() => setSidebarOpen(false)}
                aria-label="Close"
              />
            </div>
          </div>
          <Nav vertical className="flex-grow-1 p-2">
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'dashboard'}
                onClick={(e) => { e.preventDefault(); setView('dashboard'); setSidebarOpen(false); }}
                className={`text-white ${view === 'dashboard' ? 'bg-primary' : ''}`}
              >
                <LayoutDashboard size={18} className="me-2" /> Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'pages'}
                onClick={(e) => { e.preventDefault(); setView('pages'); setSidebarOpen(false); }}
                className={`text-white ${view === 'pages' ? 'bg-primary' : ''}`}
              >
                <Type size={18} className="me-2" /> Pages Text
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'content'}
                onClick={(e) => { e.preventDefault(); setView('content'); setSidebarOpen(false); }}
                className={`text-white ${view === 'content' ? 'bg-primary' : ''}`}
              >
                <FileText size={18} className="me-2" /> Blog & Courses
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'team'}
                onClick={(e) => { e.preventDefault(); setView('team'); setSidebarOpen(false); }}
                className={`text-white ${view === 'team' ? 'bg-primary' : ''}`}
              >
                <Users size={18} className="me-2" /> Team & Reviews
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'leads'}
                onClick={(e) => { e.preventDefault(); setView('leads'); setSidebarOpen(false); }}
                className={`text-white ${view === 'leads' ? 'bg-primary' : ''}`}
              >
                <Star size={18} className="me-2" /> Leads <Badge color="info">{leads.length}</Badge>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'announcements'}
                onClick={(e) => { e.preventDefault(); setView('announcements'); setSidebarOpen(false); }}
                className={`text-white ${view === 'announcements' ? 'bg-primary' : ''}`}
              >
                <Star size={18} className="me-2" /> Announcements
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'settings'}
                onClick={(e) => { e.preventDefault(); setView('settings'); setSidebarOpen(false); }}
                className={`text-white ${view === 'settings' ? 'bg-primary' : ''}`}
              >
                <Settings size={18} className="me-2" /> Settings
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'lists'}
                onClick={(e) => { e.preventDefault(); setView('lists'); setSidebarOpen(false); }}
                className={`text-white ${view === 'lists' ? 'bg-primary' : ''}`}
              >
                <Database size={18} className="me-2" /> Lists
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink 
                href="#" 
                active={view === 'components'}
                onClick={(e) => { e.preventDefault(); setView('components'); setSidebarOpen(false); }}
                className={`text-white ${view === 'components' ? 'bg-primary' : ''}`}
              >
                <FileText size={18} className="me-2" /> Components
              </NavLink>
            </NavItem>
          </Nav>
          <div className="p-3 border-top border-secondary">
            <small className="text-muted d-block mb-2">Logged in as: {user?.email}</small>
            <Button 
              color="danger" 
              outline 
              block 
              onClick={handleLogout}
              className="d-flex align-items-center justify-content-center"
            >
              <LogOut size={18} className="me-2" /> Logout
            </Button>
          </div>
        </Col>

        {/* Main Content - Responsive */}
        <Col xs={12} md={9} lg={10} className="ms-md-auto">
          <div className="p-3">
            {/* Mobile Menu Button */}
            <Button 
              color="dark" 
              className="d-md-none mb-3"
              onClick={() => setSidebarOpen(true)}
            >
              ☰ Menu
            </Button>
        
        {/* DASHBOARD VIEW */}
        {view === 'dashboard' && (
          <div>
            <h1 className="h3 mb-4">Overview</h1>
            <Row className="mb-4">
              <Col xs={12} md={4} className="mb-3">
                <Card>
                  <CardBody>
                    <h6 className="text-muted text-uppercase small">Total Leads</h6>
                    <h2 className="display-4 fw-bold">{leads.length}</h2>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} md={4} className="mb-3">
                <Card>
                  <CardBody>
                    <h6 className="text-muted text-uppercase small">Active Courses</h6>
                    <h2 className="display-4 fw-bold">{courses.length}</h2>
                  </CardBody>
                </Card>
              </Col>
              <Col xs={12} md={4} className="mb-3">
                <Card>
                  <CardBody>
                    <h6 className="text-muted text-uppercase small">Blog Posts</h6>
                    <h2 className="display-4 fw-bold">{blogPosts.length}</h2>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            
            <Card>
              <CardHeader>
                <h5 className="mb-0">Data Management</h5>
              </CardHeader>
              <CardBody>
                <p className="text-muted mb-3">Export your current website state (including leads and content updates) to a JSON file compatible with Firebase import.</p>
                <Button color="primary" onClick={handleExport}>
                  <Download size={18} className="me-2" /> Download Firebase Import File
                </Button>
              </CardBody>
            </Card>
          </div>
        )}

        {/* PAGES TEXT EDITOR VIEW */}
        {view === 'pages' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-800">Page Content Editor</h1>
              <button
                onClick={() => {
                  // Save is already happening on change, but add explicit save button
                  alert('Page content saved! Changes are saved automatically as you type.');
                }}
                className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-600 transition flex items-center gap-2"
              >
                <Save size={18} /> Save All Changes
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Home Page</h2>
                {renderContentInputs('home', pageContent.home)}
              </div>
              
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">About Page</h2>
                  {renderContentInputs('about', pageContent.about)}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-xl font-bold mb-4 border-b pb-2">Contact Page</h2>
                  {renderContentInputs('contact', pageContent.contact)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TEAM & REVIEWS VIEW */}
        {view === 'team' && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Team & Testimonials</h1>
            
            {/* Team */}
            <div className="mb-12">
               <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Faculty Members</h2>
                <button 
                    onClick={() => onUpdateTeam([...team, { id: Date.now().toString(), name: 'New Member', role: 'Instructor', bio: 'Bio here', image: 'https://picsum.photos/300/300' }])}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                >
                  <Plus size={16} /> Add Member
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member, idx) => (
                        <tr key={member.id} className="border-b border-slate-100 last:border-0">
                            <td className="p-4">
                                <input 
                                    className="border rounded p-1 w-full" 
                                    value={member.name} 
                                    onChange={(e) => {
                                        const newTeam = [...team];
                                        newTeam[idx].name = e.target.value;
                                        onUpdateTeam(newTeam);
                                    }}
                                />
                            </td>
                            <td className="p-4">
                                <input 
                                    className="border rounded p-1 w-full" 
                                    value={member.role} 
                                    onChange={(e) => {
                                        const newTeam = [...team];
                                        newTeam[idx].role = e.target.value;
                                        onUpdateTeam(newTeam);
                                    }}
                                />
                            </td>
                            <td className="p-4">
                                <button 
                                    onClick={() => onUpdateTeam(team.filter(t => t.id !== member.id))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Testimonials */}
            <div>
               <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Testimonials</h2>
                <button 
                    onClick={() => onUpdateTestimonials([...testimonials, { id: Date.now().toString(), name: 'Happy Student', role: 'Student', quote: 'This was great!' }])}
                    className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2"
                >
                  <Plus size={16} /> Add Review
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold">Name</th>
                      <th className="p-4 font-bold">Quote</th>
                      <th className="p-4 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map((t, idx) => (
                        <tr key={t.id} className="border-b border-slate-100 last:border-0">
                            <td className="p-4">
                                <input 
                                    className="border rounded p-1 w-full font-bold" 
                                    value={t.name} 
                                    onChange={(e) => {
                                        const newTests = [...testimonials];
                                        newTests[idx].name = e.target.value;
                                        onUpdateTestimonials(newTests);
                                    }}
                                />
                            </td>
                            <td className="p-4">
                                <textarea 
                                    className="border rounded p-1 w-full h-16" 
                                    value={t.quote} 
                                    onChange={(e) => {
                                        const newTests = [...testimonials];
                                        newTests[idx].quote = e.target.value;
                                        onUpdateTestimonials(newTests);
                                    }}
                                />
                            </td>
                            <td className="p-4">
                                <button 
                                    onClick={() => onUpdateTestimonials(testimonials.filter(item => item.id !== t.id))}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT VIEW (Courses & Blog) */}
        {view === 'content' && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Courses & Blog Manager</h1>
            
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Courses</h2>
                  <p className="text-sm text-slate-500">
                    Featured: {courses.filter(c => c.featured && !c.disabled).length}/3 | 
                    Total: {courses.length} | 
                    Disabled: {courses.filter(c => c.disabled).length}
                  </p>
                </div>
                <button 
                  onClick={handleAddCourse}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition"
                >
                  <Plus size={16} /> Add Course
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold text-slate-700">Title</th>
                      <th className="p-4 font-bold text-slate-700">Category</th>
                      <th className="p-4 font-bold text-slate-700">Status</th>
                      <th className="p-4 font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr 
                        key={course.id} 
                        className={`border-b border-slate-100 last:border-0 hover:bg-slate-50 ${course.disabled ? 'opacity-50' : ''}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {course.featured && !course.disabled && (
                              <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            )}
                            {course.disabled && (
                              <EyeOff size={16} className="text-slate-400" />
                            )}
                            <span className={course.disabled ? 'line-through' : ''}>{course.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{course.category}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            {course.featured && !course.disabled && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Featured</span>
                            )}
                            {course.disabled && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Disabled</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditCourse(course)} 
                              className="text-blue-500 hover:text-blue-700 p-2"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
                                  onDeleteCourse(course.id);
                                }
                              }} 
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Blog Posts</h2>
                  <p className="text-sm text-slate-500">Total: {blogPosts.length}</p>
                </div>
                <button 
                  onClick={handleAddBlogPost}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition"
                >
                  <Plus size={16} /> Add Post
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold text-slate-700">Title</th>
                      <th className="p-4 font-bold text-slate-700">Author</th>
                      <th className="p-4 font-bold text-slate-700">Category</th>
                      <th className="p-4 font-bold text-slate-700">Date</th>
                      <th className="p-4 font-bold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map(post => (
                      <tr key={post.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-4 font-medium">{post.title}</td>
                        <td className="p-4">{post.author}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">{post.category}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">{post.date}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditBlogPost(post)} 
                              className="text-blue-500 hover:text-blue-700 p-2"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                  onDeletePost(post.id);
                                }
                              }} 
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Course Editor Modal */}
        {showCourseModal && (
          <CourseEditor
            course={editingCourse}
            courses={courses}
            onSave={handleSaveCourse}
            onClose={() => {
              setShowCourseModal(false);
              setEditingCourse(null);
            }}
          />
        )}

        {/* Blog Editor Modal */}
        {showBlogModal && (
          <BlogEditor
            post={editingBlog}
            team={team}
            onSave={handleSaveBlogPost}
            onClose={() => {
              setShowBlogModal(false);
              setEditingBlog(null);
            }}
          />
        )}

        {/* Announcement Editor Modal */}
        {showAnnouncementModal && (
          <AnnouncementEditor
            announcements={announcements || []}
            onSave={handleSaveAnnouncement}
            onDelete={onDeleteAnnouncement}
            onClose={() => setShowAnnouncementModal(false)}
          />
        )}

        {/* LEADS VIEW */}
        {view === 'leads' && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Leads & Submissions</h1>
            {leads.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-xl shadow-sm">
                <p className="text-slate-500">No form submissions yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-4 font-bold text-slate-700">Name</th>
                      <th className="p-4 font-bold text-slate-700">Email</th>
                      <th className="p-4 font-bold text-slate-700">Type/Course</th>
                      <th className="p-4 font-bold text-slate-700">Date</th>
                      <th className="p-4 font-bold text-slate-700">Message/Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => (
                      <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-4 font-medium">{lead.studentName || lead.name}</td>
                        <td className="p-4">{lead.email}</td>
                        <td className="p-4">
                          {lead.courseId ? (
                            <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-bold">Enrollment: {lead.courseId}</span>
                          ) : (
                            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded text-xs font-bold">Contact: {lead.subject}</span>
                          )}
                        </td>
                        <td className="p-4 text-sm text-slate-500">{lead.date}</td>
                        <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{lead.message || lead.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* LISTS MANAGEMENT VIEW */}
        {view === 'lists' && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">List Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ListManager listType="categories" />
              <ListManager listType="instructors" />
              <ListManager listType="levels" />
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS VIEW */}
        {view === 'announcements' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Announcement Modals</h1>
                <p className="text-slate-600 mt-2">
                  Manage announcement modals that appear on the homepage. Up to 5 announcements can be saved.
                  One will be randomly selected and displayed to visitors.
                </p>
              </div>
              <button
                onClick={() => setShowAnnouncementModal(true)}
                className="bg-primary text-white px-6 py-3 rounded font-bold hover:bg-blue-600 transition flex items-center gap-2"
                disabled={announcements.length >= 5}
              >
                <Plus size={20} /> Add Announcement
              </button>
            </div>

            {/* Announcements List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="p-4 font-bold text-slate-700">Title</th>
                    <th className="p-4 font-bold text-slate-700">Status</th>
                    <th className="p-4 font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-8 text-center text-slate-500">
                        No announcements yet. Click "Add Announcement" to create one.
                      </td>
                    </tr>
                  ) : (
                    announcements.map(ann => (
                      <tr key={ann.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-4 font-medium">{ann.title || 'Untitled'}</td>
                        <td className="p-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!ann.disabled}
                              onChange={async (e) => {
                                const updated = { ...ann, disabled: !e.target.checked };
                                await onUpdateAnnouncement(updated);
                              }}
                              className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <span className={`text-sm font-bold ${ann.disabled ? 'text-red-600' : 'text-green-600'}`}>
                              {ann.disabled ? 'Disabled' : 'Enabled'}
                            </span>
                          </label>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingCourse(null);
                                setEditingBlog(null);
                                setShowAnnouncementModal(true);
                                // Set the announcement to edit in the modal
                                const announcementToEdit = announcements.find(a => a.id === ann.id);
                                if (announcementToEdit) {
                                  // We'll need to pass this to the modal
                                }
                              }}
                              className="text-blue-500 hover:text-blue-700 p-2"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete "${ann.title}"?`)) {
                                  onDeleteAnnouncement(ann.id);
                                }
                              }}
                              className="text-red-500 hover:text-red-700 p-2"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {view === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold mb-8 text-slate-800">Settings</h1>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-2xl">
              <h2 className="text-xl font-bold mb-6">Social Media & Integration</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Facebook URL</label>
                  <input 
                    type="text" 
                    value={settings.facebookUrl}
                    onChange={(e) => onUpdateSettings({...settings, facebookUrl: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                  <input 
                    type="text" 
                    value={settings.instagramUrl}
                    onChange={(e) => onUpdateSettings({...settings, instagramUrl: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Twitter/X URL</label>
                  <input 
                    type="text" 
                    value={settings.twitterUrl}
                    onChange={(e) => onUpdateSettings({...settings, twitterUrl: e.target.value})}
                    className="w-full p-3 border border-slate-300 rounded focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-bold text-lg mb-2">Social Feed Sync</h3>
                <p className="text-sm text-slate-500 mb-4">Manually trigger a simulated sync with connected Instagram/Facebook accounts to update the Blog page feed.</p>
                <button onClick={onSyncSocial} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded font-bold hover:bg-slate-700 transition">
                  <RefreshCw size={18} /> Sync Social Feed Now
                </button>
              </div>
            </div>
          </div>
        )}

          </div>
        </Col>
      </Row>
    </Container>
  );
};
