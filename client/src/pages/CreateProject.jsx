import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProject } from '../services/api';
import FormattedDescription from '../components/FormattedDescription.jsx';
import { 
  Send, 
  Eye, 
  Edit3, 
  RotateCcw, 
  Banknote, 
  FileText,
  X,
  ArrowRight
} from 'lucide-react';

const PROJECT_TEMPLATES = [
  {
    id: 'smartbiz',
    name: 'SmartBiz AI – Business Automation & CRM',
    tag: 'Business SaaS & AI',
    budgetFormatted: 'Rs. 80,000',
    summary: 'All-in-one small business management platform with CRM, invoicing, inventory, and AI analytics.',
    data: {
      title: 'SmartBiz AI – All-in-One Business Management & Automation Platform',
      budget: '80000',
      budgetNote: 'Budget is negotiable depending on experience, proposed solution, and project scope.',
      overview: `I'm planning to build a startup focused on helping small businesses manage and automate their daily operations through a modern, user-friendly web platform.

The goal is to create an all-in-one SaaS platform where small business owners can manage their business without needing multiple applications.`,
      features: `Business Dashboard – Revenue, expenses, sales analytics and business insights.
Customer Management (CRM) – Store customer details, purchase history and interactions.
Inventory Management – Track products, stock levels and low-stock alerts.
Billing & Invoicing – Generate professional invoices and manage payments.
AI Business Assistant – AI-powered insights, business suggestions and automated reports.
Sales Analytics – Visual charts, reports and performance tracking.
Notifications – Automated reminders for payments, stock updates and customer follow-ups.
Multi-Device Support – Fully responsive design for desktop, tablet and mobile.`,
      techStack: `React.js / Next.js
Node.js / Express.js
PostgreSQL / MongoDB
Gemini API / OpenAI API
Razorpay
AWS / Vercel`,
      deliverables: `Complete responsive web application.
Admin and business-owner dashboards.
Secure authentication and authorization.
Backend APIs and database integration.
Clean, modern UI/UX.
Source code and deployment.
Basic documentation.`,
      requirements: `Strong full-stack development experience.
Previous SaaS or startup project experience preferred.
Good UI/UX development skills.
Ability to build scalable and maintainable applications.
Must share previous projects or portfolio.`,
      closingNote: `I'm looking for developers who can turn this idea into a working product, not just create a basic demo. Interested freelancers can submit their proposals with estimated timelines, pricing and relevant experience.`
    }
  },
  {
    id: 'careconnect',
    name: 'CareConnect – Telehealth & Clinic Management',
    tag: 'Healthcare & Telemedicine',
    budgetFormatted: 'Rs. 65,000',
    summary: 'Virtual doctor appointments, patient medical records, appointment scheduling, and automated billing.',
    data: {
      title: 'CareConnect – Modern Telehealth & Clinic Management Platform',
      budget: '65000',
      budgetNote: 'Budget is open to discussion based on experience and proposed architecture.',
      overview: `We are building CareConnect, a modern clinic and telehealth management platform designed to streamline doctor consultations, digital prescriptions, and patient records for outpatient clinics.

The platform will provide an intuitive experience for patients to book virtual or in-person visits while giving healthcare providers a clean portal to manage their daily practice.`,
      features: `Telehealth Video Consultations – WebRTC-based high-quality virtual appointments between doctors and patients.
Smart Appointment Booking – Interactive calendar with instant slot reservation and automated reminder alerts.
Digital Medical Records (EHR) – Centralized patient profiles, prescription history, and lab reports.
Automated Billing & Invoices – Instant invoice creation and payment gateway integration.
Doctor Practice Dashboard – Daily patient schedule, consultation analytics, and earnings summaries.`,
      techStack: `React.js / Next.js
Node.js / Express.js
PostgreSQL or MongoDB
WebRTC / Socket.io
Stripe / Razorpay
AWS / Vercel`,
      deliverables: `Fully responsive web application for desktop and mobile
Doctor consultation portal and patient scheduling interface
Secure role-based authentication and user management
Clean API documentation and automated tests
Source code repository and deployment configuration`,
      requirements: `Demonstrated experience in full-stack React and Node.js applications
Prior experience with video streaming, WebSockets, or scheduling systems is a plus
Focus on clean, accessible UI/UX and maintainable code
Must share links to past production work or GitHub repositories`,
      closingNote: `We are looking for dedicated developers to turn this into a scalable production platform. Please provide your estimated timeframe and relevant portfolio links with your proposal.`
    }
  },
  {
    id: 'shopwave',
    name: 'ShopWave – Multi-Vendor Marketplace',
    tag: 'E-Commerce Platform',
    budgetFormatted: 'Rs. 75,000',
    summary: 'Multi-vendor marketplace with customer storefronts, seller portals, automated payouts, and cart checkout.',
    data: {
      title: 'ShopWave – Multi-Vendor E-Commerce Marketplace',
      budget: '75000',
      budgetNote: 'Milestone-based budget with performance bonuses for early completion.',
      overview: `ShopWave is an upcoming multi-vendor marketplace connecting local artisan sellers and brands directly to consumers. We need an end-to-end web platform featuring customer storefronts, independent vendor dashboards, product inventory management, and automated payment commission splitting.`,
      features: `Storefront & Product Catalog – Fast product discovery with advanced filters, categories, and search.
Vendor Management Portal – Vendor onboarding, product uploads, order processing, and sales analytics.
Shopping Cart & Checkout – Multi-vendor cart with order tracking and payment processing.
Customer Reviews & Ratings – Verified purchase reviews, star ratings, and seller feedback.
Commission & Payout Engine – Automated calculation of platform fees and vendor balance payouts.`,
      techStack: `React.js / Next.js
Node.js / Express
PostgreSQL
Redis
Stripe / Razorpay
AWS S3 / CloudFront`,
      deliverables: `Customer web storefront and checkout flow
Seller onboarding and vendor management dashboard
Super-admin control panel for marketplace operations
Database schema design and RESTful backend APIs
Automated email and SMS notification system
Production deployment and handover documentation`,
      requirements: `Extensive experience with e-commerce systems or multi-vendor platforms
Strong understanding of payment gateway integrations and order lifecycle state machines
Proficiency in relational databases and scalable caching strategies
Commitment to responsive, accessible, and fast web experiences`,
      closingNote: `We are looking for an experienced full-stack engineer who takes ownership of their work. Please include links to previous e-commerce platforms or marketplaces you have built.`
    }
  }
];

const EMPTY_FORM = {
  title: '',
  budget: '',
  budgetNote: '',
  overview: '',
  features: '',
  techStack: '',
  deliverables: '',
  requirements: '',
  closingNote: ''
};

// Formats Key Features: Feature Name – Description -> 1. **Feature Name** – Description
const formatFeatures = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const cleanLine = line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '').trim();
      const sepMatch = cleanLine.match(/^(.*?)\s*(?:[–—\-:]\s+|\s+[-–—:]\s*)(.*)$/);
      if (sepMatch) {
        const featureName = sepMatch[1].replace(/\*\*/g, '').trim();
        const desc = sepMatch[2].trim();
        return `${idx + 1}. **${featureName}** – ${desc}`;
      }
      return `${idx + 1}. **${cleanLine.replace(/\*\*/g, '')}**`;
    })
    .join('\n');
};

// Converts single lines into bullet points: line -> - line
const formatBullets = (text) => {
  if (!text) return '';
  return text
    .split('\n')
    .map((l) => l.trim().replace(/^[-*•]\s*/, ''))
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join('\n');
};

// Assembles all fields into clean markdown
const assembleDescription = (data) => {
  let md = '';

  if (data.overview?.trim()) {
    md += `### Project Description\n\n${data.overview.trim()}\n\n`;
  }

  const formattedFeatures = formatFeatures(data.features);
  if (formattedFeatures) {
    md += `**Key Features:**\n\n${formattedFeatures}\n\n`;
  }

  const formattedTech = formatBullets(data.techStack);
  if (formattedTech) {
    md += `### Preferred Technology Stack\n\n${formattedTech}\n\n`;
  }

  const formattedDeliverables = formatBullets(data.deliverables);
  if (formattedDeliverables) {
    md += `### Expected Deliverables\n\n${formattedDeliverables}\n\n`;
  }

  if (data.budgetNote?.trim()) {
    md += `${data.budgetNote.trim()}\n\n`;
  }

  const formattedRequirements = formatBullets(data.requirements);
  if (formattedRequirements) {
    md += `### Freelancer Requirements\n\n${formattedRequirements}\n\n`;
  }

  if (data.closingNote?.trim()) {
    md += `**${data.closingNote.trim()}**\n`;
  }

  return md.trim();
};

const CreateProject = () => {
  // Empty by default when opening the page
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectTemplate = (template) => {
    setFormData(template.data);
    setIsTemplateModalOpen(false);
    toast.success(`Loaded "${template.name}" template!`);
  };

  const handleReset = () => {
    setFormData(EMPTY_FORM);
    toast.info('Form cleared.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      return toast.error('Please enter a project title.');
    }
    if (!formData.budget) {
      return toast.error('Please enter a budget.');
    }
    if (!formData.overview?.trim()) {
      return toast.error('Please enter the project description.');
    }

    const compiledDescription = assembleDescription(formData);
    if (!compiledDescription) {
      return toast.error('Project description cannot be empty.');
    }

    setIsSubmitting(true);
    try {
      await createProject({
        title: formData.title.trim(),
        description: compiledDescription,
        budget: Number(formData.budget),
      });
      toast.success('Project posted successfully!');
      navigate('/client');
    } catch (err) {
      toast.error(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const compiledMarkdown = assembleDescription(formData);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Post a Project
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Provide project details to attract proposals from qualified freelancers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              Load Template
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} className="inline mr-1" />
              Reset
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Edit3 size={15} className="inline mr-1.5" />
            Edit Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye size={15} className="inline mr-1.5" />
            Preview Post
          </button>
        </div>
      </div>

      {activeTab === 'preview' ? (
        /* Preview Tab */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Preview: How freelancers see your job
              </span>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit3 size={13} /> Edit Details
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
              {formData.title || 'Untitled Project'}
            </h1>

            <div className="mt-3 pb-4 border-b border-gray-100 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-sm">
                <Banknote size={15} className="text-emerald-600" />
                Budget: Rs. {Number(formData.budget || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-500">Fixed-Price</span>
            </div>

            <div className="mt-6">
              <FormattedDescription content={compiledMarkdown} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 text-sm cursor-pointer"
            >
              Back to Edit
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:bg-gray-400 cursor-pointer"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Posting...' : 'Post Project'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Title & Budget */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <FileText size={16} className="text-blue-600" />
              <h2 className="text-base font-bold text-gray-900">Project Title & Budget</h2>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., CareConnect – Modern Telehealth & Clinic Management Platform"
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-800 mb-1">
                  Budget (in Rs.) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center font-semibold text-gray-500 text-xs">
                    Rs.
                  </span>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 65000"
                    className="pl-10 w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="budgetNote" className="block text-sm font-medium text-gray-800 mb-1">
                  Budget Note (Optional)
                </label>
                <input
                  type="text"
                  id="budgetNote"
                  name="budgetNote"
                  value={formData.budgetNote}
                  onChange={handleChange}
                  placeholder="e.g., Budget is open to discussion based on experience..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div>
              <label htmlFor="overview" className="block text-sm font-medium text-gray-800 mb-0.5">
                Project Description <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Explain the problem being solved, the project goals, and what you want built.
              </p>
              <textarea
                id="overview"
                name="overview"
                value={formData.overview}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project here..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Section 3: Key Features */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-800 mb-0.5">
                Key Features
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter each feature on a single line in this format: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">Feature Name – Description</code>. Feature names will be bolded automatically.
              </p>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows={5}
                placeholder={`Telehealth Consultations – Secure video calling between doctors and patients.\nSmart Appointment Booking – Interactive calendar with automated reminders.\nDigital Medical Records – Centralized patient profiles and prescription history.`}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section 4: Technologies */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div>
              <label htmlFor="techStack" className="block text-sm font-medium text-gray-800 mb-0.5">
                Preferred Technologies (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter the technologies, frameworks, or tools you prefer (one per line). Bullets are added automatically.
              </p>
              <textarea
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                rows={4}
                placeholder={`React.js / Next.js\nNode.js / Express\nPostgreSQL or MongoDB`}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section 5: Deliverables */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div>
              <label htmlFor="deliverables" className="block text-sm font-medium text-gray-800 mb-0.5">
                Expected Deliverables
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter each expected deliverable on a single line (bullets are added automatically).
              </p>
              <textarea
                id="deliverables"
                name="deliverables"
                value={formData.deliverables}
                onChange={handleChange}
                rows={4}
                placeholder={`Fully responsive web application\nAdmin and clinic dashboard\nClean API documentation and tests\nSource code repository and deployment`}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Section 6: Requirements & Closing Note */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-800 mb-0.5">
                Freelancer Requirements
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Enter each requirement or skill on a single line (bullets are added automatically).
              </p>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={4}
                placeholder={`Proven experience in full-stack web development\nExperience with scheduling or real-time systems\nMust share links to past production work or portfolio`}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div>
              <label htmlFor="closingNote" className="block text-sm font-medium text-gray-800 mb-0.5">
                Note for Applicants (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                A short concluding note or expectation for freelancers.
              </p>
              <textarea
                id="closingNote"
                name="closingNote"
                value={formData.closingNote}
                onChange={handleChange}
                rows={2}
                placeholder="We are looking for dedicated developers to turn this into a scalable platform. Please include your estimated timeframe and relevant portfolio links."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm leading-relaxed focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Eye size={15} />
              <span>Preview Post</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors disabled:bg-gray-400 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Posting...' : 'Post Project'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-2xl w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Choose a Project Template</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select an example to populate the form. You can freely edit any details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {PROJECT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all cursor-pointer group text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                          {tmpl.tag}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          {tmpl.budgetFormatted}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mt-1.5">
                        {tmpl.name}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {tmpl.summary}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex-shrink-0 mt-2">
                      Use Template <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProject;
