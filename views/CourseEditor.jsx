import React, { useState, useEffect } from 'react';
import { X, Save, Star } from 'lucide-react';

export const CourseEditor = ({ course, courses, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    category: '',
    shortDescription: '',
    fullDescription: '',
    instructor: '',
    duration: '',
    level: '',
    image: '',
    featured: false,
    disabled: false,
    syllabus: [],
    preview: {
      type: 'quiz',
      title: '',
      description: '',
      quizData: [],
      videoUrl: '',
      documentUrl: ''
    }
  });

  const [syllabusItem, setSyllabusItem] = useState('');
  const [previewType, setPreviewType] = useState('quiz');
  const [quizQuestion, setQuizQuestion] = useState({ question: '', options: ['', '', '', ''], correctAnswer: 0 });

  const featuredCount = courses.filter(c => c.featured && !c.disabled).length;
  const canFeature = !formData.disabled && (formData.featured || featuredCount < 3);

  useEffect(() => {
    if (course) {
      setFormData({
        id: course.id || '',
        title: course.title || '',
        category: course.category || '',
        shortDescription: course.shortDescription || '',
        fullDescription: course.fullDescription || '',
        instructor: course.instructor || '',
        duration: course.duration || '',
        level: course.level || '',
        image: course.image || '',
        featured: course.featured || false,
        disabled: course.disabled || false,
        syllabus: course.syllabus || [],
        preview: course.preview || {
          type: 'quiz',
          title: '',
          description: '',
          quizData: [],
          videoUrl: '',
          documentUrl: ''
        }
      });
      setPreviewType(course.preview?.type || 'quiz');
    }
  }, [course]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate featured limit
    if (formData.featured && !formData.disabled) {
      const currentFeatured = courses.filter(c => c.featured && !c.disabled && c.id !== formData.id).length;
      if (currentFeatured >= 3) {
        alert('Maximum 3 courses can be featured. Please unfeature another course first.');
        return;
      }
    }

    const courseData = {
      ...formData,
      preview: {
        type: previewType,
        title: formData.preview.title,
        description: formData.preview.description,
        ...(previewType === 'quiz' && { quizData: formData.preview.quizData }),
        ...(previewType === 'video' && { videoUrl: formData.preview.videoUrl }),
        ...(previewType === 'document' && { documentUrl: formData.preview.documentUrl })
      }
    };

    onSave(courseData);
  };

  const addSyllabusItem = () => {
    if (syllabusItem.trim()) {
      setFormData({
        ...formData,
        syllabus: [...formData.syllabus, syllabusItem.trim()]
      });
      setSyllabusItem('');
    }
  };

  const removeSyllabusItem = (index) => {
    setFormData({
      ...formData,
      syllabus: formData.syllabus.filter((_, i) => i !== index)
    });
  };

  const addQuizQuestion = () => {
    if (quizQuestion.question.trim() && quizQuestion.options.every(opt => opt.trim())) {
      setFormData({
        ...formData,
        preview: {
          ...formData.preview,
          quizData: [...(formData.preview.quizData || []), { ...quizQuestion }]
        }
      });
      setQuizQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
    }
  };

  const removeQuizQuestion = (index) => {
    setFormData({
      ...formData,
      preview: {
        ...formData.preview,
        quizData: formData.preview.quizData.filter((_, i) => i !== index)
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {course ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Course ID *</label>
              <input
                type="text"
                required
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="logic-101"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Category *</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="Logic"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Short Description *</label>
            <textarea
              required
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Description *</label>
            <textarea
              required
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-32"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Instructor *</label>
              <input
                type="text"
                required
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Duration *</label>
              <input
                type="text"
                required
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="10 Weeks"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Level *</label>
              <input
                type="text"
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="Middle School"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
            />
          </div>

          {/* Flags */}
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => {
                  if (e.target.checked && !canFeature) {
                    alert(`Maximum 3 courses can be featured. Currently ${featuredCount} are featured.`);
                    return;
                  }
                  setFormData({ ...formData, featured: e.target.checked });
                }}
                disabled={!canFeature && !formData.featured}
                className="w-4 h-4"
              />
              <Star size={16} className={formData.featured ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'} />
              <span className="text-sm font-bold">Featured on Homepage</span>
              {!canFeature && !formData.featured && (
                <span className="text-xs text-red-500">(Max 3 featured)</span>
              )}
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disabled}
                onChange={(e) => {
                  const newDisabled = e.target.checked;
                  setFormData({ 
                    ...formData, 
                    disabled: newDisabled,
                    featured: newDisabled ? false : formData.featured
                  });
                }}
                className="w-4 h-4"
              />
              <span className="text-sm font-bold">Disabled (Hidden from public)</span>
            </label>
          </div>

          {/* Syllabus */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Syllabus Items</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={syllabusItem}
                onChange={(e) => setSyllabusItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSyllabusItem())}
                className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                placeholder="Add syllabus item"
              />
              <button
                type="button"
                onClick={addSyllabusItem}
                className="bg-primary text-white px-4 py-2 rounded font-bold hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.syllabus.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                  <span className="text-sm">{item}</span>
                  <button
                    type="button"
                    onClick={() => removeSyllabusItem(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold mb-4">Course Preview</h3>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Preview Type</label>
              <select
                value={previewType}
                onChange={(e) => setPreviewType(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              >
                <option value="quiz">Quiz</option>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Preview Title</label>
              <input
                type="text"
                value={formData.preview.title}
                onChange={(e) => setFormData({
                  ...formData,
                  preview: { ...formData.preview, title: e.target.value }
                })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-1">Preview Description</label>
              <textarea
                value={formData.preview.description}
                onChange={(e) => setFormData({
                  ...formData,
                  preview: { ...formData.preview, description: e.target.value }
                })}
                className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary h-20"
              />
            </div>

            {previewType === 'video' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">Video URL</label>
                <input
                  type="url"
                  value={formData.preview.videoUrl || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    preview: { ...formData.preview, videoUrl: e.target.value }
                  })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {previewType === 'document' && (
              <div className="mb-4">
                <label className="block text-sm font-bold text-slate-700 mb-1">Document URL</label>
                <input
                  type="url"
                  value={formData.preview.documentUrl || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    preview: { ...formData.preview, documentUrl: e.target.value }
                  })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {previewType === 'quiz' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Quiz Questions</label>
                <div className="space-y-4 mb-4">
                  {formData.preview.quizData?.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-50 p-4 rounded border border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-sm">Question {qIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-sm mb-2">{q.question}</p>
                      <ul className="text-xs space-y-1">
                        {q.options.map((opt, optIndex) => (
                          <li key={optIndex} className={optIndex === q.correctAnswer ? 'text-green-600 font-bold' : ''}>
                            {optIndex === q.correctAnswer ? '✓ ' : ''}{opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border border-slate-300 rounded p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">Question</label>
                    <input
                      type="text"
                      value={quizQuestion.question}
                      onChange={(e) => setQuizQuestion({ ...quizQuestion, question: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Options</label>
                    {quizQuestion.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={quizQuestion.correctAnswer === optIndex}
                          onChange={() => setQuizQuestion({ ...quizQuestion, correctAnswer: optIndex })}
                          className="w-4 h-4"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...quizQuestion.options];
                            newOptions[optIndex] = e.target.value;
                            setQuizQuestion({ ...quizQuestion, options: newOptions });
                          }}
                          className="flex-1 p-2 border border-slate-300 rounded"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-600"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-3 rounded font-bold hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save Course
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 rounded font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

