import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // App Title
  'app.title': { en: 'Simhastha Cleanmap', hi: 'सिंहस्थ क्लीनमैप' },
  'app.subtitle': { en: 'Mobile Sanitation App', hi: 'मोबाइल स्वच्छता ऐप' },

  // Navigation
  'nav.dashboard': { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  'nav.volunteerReports': { en: 'Volunteer Reports', hi: 'स्वयंसेवक रिपोर्ट' },
  'nav.staffAudits': { en: 'Staff Sanitation Audits', hi: 'स्टाफ स्वच्छता ऑडिट' },
  'nav.staffManagement': { en: 'Staff Sanitation Management', hi: 'स्टाफ स्वच्छता प्रबंधन' },
  'nav.facilityRegistry': { en: 'Facility Registry', hi: 'सुविधा रजिस्ट्री' },
  'nav.qrAudit': { en: 'QR Confirmation', hi: 'क्यूआर पुष्टि' },
  'nav.reportIssue': { en: 'Report Issue', hi: 'समस्या रिपोर्ट करें' },
  'nav.scanner': { en: 'Scanner', hi: 'स्कैनर' },

  // Login
  'login.title': { en: 'Simhastha Cleanmap', hi: 'सिंहस्थ क्लीनमैप' },
  'login.subtitle': { en: 'Keeping Simhastha Clean Together', hi: 'सिंहस्थ को साफ रखना' },
  'login.selectRole': { en: 'Select Your Role', hi: 'अपनी भूमिका चुनें' },
  'login.volunteer': { en: 'Volunteer/श्रद्धालु', hi: 'स्वयंसेवक/श्रद्धालु' },
  'login.staff': { en: 'Sanitation Staff', hi: 'स्वच्छता स्टाफ' },
  'login.admin': { en: 'Admin', hi: 'एडमिन' },
  'login.volunteerDesc': { en: 'Report Issues', hi: 'समस्या रिपोर्ट करें' },
  'login.staffDesc': { en: 'Manage Tasks', hi: 'कार्य प्रबंधन' },
  'login.adminDesc': { en: 'System Control', hi: 'सिस्टम नियंत्रण' },
  'login.quickDemo': { en: 'Quick Demo Login', hi: 'त्वरित डेमो लॉगिन' },

  // Common
  'common.submit': { en: 'Submit', hi: 'जमा करें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.location': { en: 'Location', hi: 'स्थान' },
  'common.save': { en: 'Save', hi: 'सेव करें' },
  'common.edit': { en: 'Edit', hi: 'संपादित करें' },
  'common.delete': { en: 'Delete', hi: 'हटाएं' },
  'common.view': { en: 'View', hi: 'देखें' },
  'common.complete': { en: 'Complete', hi: 'पूर्ण करें' },
  'common.pending': { en: 'Pending', hi: 'लंबित' },
  'common.completed': { en: 'Completed', hi: 'पूर्ण' },
  'common.inProgress': { en: 'In Progress', hi: 'प्रगति में' },
  'common.resolved': { en: 'Resolved', hi: 'हल किया गया' },
  'common.operational': { en: 'Operational', hi: 'परिचालन' },
  'common.maintenance': { en: 'Maintenance', hi: 'रखरखाव' },
  'common.outOfOrder': { en: 'Out of Order', hi: 'खराब' },
  'common.search': { en: 'Search', hi: 'खोजें' },
  'common.filter': { en: 'Filter', hi: 'फिल्टर' },
  'common.all': { en: 'All', hi: 'सभी' },
  'common.high': { en: 'High', hi: 'उच्च' },
  'common.medium': { en: 'Medium', hi: 'मध्यम' },
  'common.low': { en: 'Low', hi: 'निम्न' },

  // Reports
  'reports.title': { en: 'Report Sanitation Issue', hi: 'स्वच्छता समस्या रिपोर्ट करें' },
  'reports.subtitle': { en: 'Help keep your community clean by reporting issues', hi: 'समस्याओं की रिपोर्ट करके अपने समुदाय को साफ रखने में मदद करें' },
  'reports.selectCategory': { en: 'Select Issue Category', hi: 'समस्या श्रेणी चुनें' },
  'reports.category': { en: 'Category', hi: 'श्रेणी' },
  'reports.issueTitle': { en: 'Issue Title', hi: 'समस्या का शीर्षक' },
  'reports.description': { en: 'Description', hi: 'विवरण' },
  'reports.location': { en: 'Location', hi: 'स्थान' },
  'reports.priority': { en: 'Priority', hi: 'प्राथमिकता' },
  'reports.takePhoto': { en: 'Take Photo', hi: 'फोटो लें' },
  'reports.getLocation': { en: 'Get Current Location', hi: 'वर्तमान स्थान प्राप्त करें' },
  'reports.submitReport': { en: 'Submit Report', hi: 'रिपोर्ट जमा करें' },
  'reports.photos': { en: 'Photos', hi: 'फोटो' },
  'reports.recentReports': { en: 'Recent Reports', hi: 'हाल की रिपोर्ट' },
  'reports.reportDetails': { en: 'Report Details', hi: 'रिपोर्ट विवरण' },
  'reports.timestamp': { en: 'Timestamp', hi: 'समय स्टैम्प' },
  'reports.noPhotos': { en: 'No photos available', hi: 'कोई फोटो उपलब्ध नहीं' },
  'reports.noPhotosDescription': { en: 'This report was submitted without photos', hi: 'यह रिपोर्ट बिना फोटो के जमा की गई थी' },

  // Categories
  'category.overflowingBin': { en: 'Overflowing Bin', hi: 'भरा हुआ कूड़ादान' },
  'category.dirtyToilet': { en: 'Dirty Toilet', hi: 'गंदा शौचालय' },
  'category.garbagePile': { en: 'Garbage Pile', hi: 'कूड़े का ढेर' },
  'category.brokenFacility': { en: 'Broken Facility', hi: 'टूटी हुई सुविधा' },
  'category.waterIssue': { en: 'Water Issue', hi: 'पानी की समस्या' },
  'category.other': { en: 'Other', hi: 'अन्य' },

  // Report content translations (simplified - no detailed descriptions needed)
  'report.overflowingGarbageBin': { en: 'Overflowing garbage bin at Park Avenue', hi: 'पार्क एवेन्यू में भरा हुआ कूड़ादान' },
  'report.toiletRequiresCleaning': { en: 'Toilet requires immediate cleaning', hi: 'शौचालय की तुरंत सफाई की आवश्यकता है' },
  'report.unauthorizedGarbageDumping': { en: 'Unauthorized garbage dumping', hi: 'अनधिकृत कूड़ा फेंकना' },
  'report.brokenWaterTap': { en: 'Broken water tap at community center', hi: 'सामुदायिक केंद्र में टूटा हुआ पानी का नल' },

  // Status translations
  'status.pending': { en: 'Pending', hi: 'लंबित' },
  'status.inProgress': { en: 'In Progress', hi: 'प्रगति में' },
  'status.resolved': { en: 'Resolved', hi: 'हल किया गया' },
  'status.completed': { en: 'Completed', hi: 'पूर्ण' },
  'status.issuesFound': { en: 'Issues Found', hi: 'समस्याएं मिलीं' },
  'status.inactive': { en: 'Inactive', hi: 'निष्क्रिय' },
  
  // Count labels
  'count.pending': { en: 'Pending', hi: 'लंबित' },
  'count.completed': { en: 'Completed', hi: 'पूर्ण' },
  
  // Reporter names
  'reporter.amitSingh': { en: 'Amit Singh', hi: 'अमित सिंह' },
  'reporter.priyaSharma': { en: 'Priya Sharma', hi: 'प्रिया शर्मा' },
  'reporter.rajeshKumar': { en: 'Rajesh Kumar', hi: 'राजेश कुमार' },
  'reporter.sunitaDevi': { en: 'Sunita Devi', hi: 'सुनीता देवी' },
  'reporter.anonymous': { en: 'Anonymous', hi: 'अज्ञात' },
  
  // Reporter combinations (Type - Name format)
  'reporter.volunteerAmit': { en: 'Volunteer - Amit Singh', hi: 'स्वयंसेवक - अमित सिंह' },
  'reporter.staffPriya': { en: 'Staff Sanitation - Priya Sharma', hi: 'स्टाफ स्वच्छता - प्रिया शर्मा' },
  'reporter.publicAnonymous': { en: 'Public - Anonymous', hi: 'जनता - अज्ञात' },
  'reporter.volunteerSunita': { en: 'Volunteer - Sunita Patel', hi: 'स्वयंसेवक - सुनीता पटेल' },
  
  // Reporter types
  'reporterType.volunteer': { en: 'Volunteer', hi: 'स्वयंसेवक' },
  'reporterType.staff': { en: 'Staff Sanitation', hi: 'स्टाफ स्वच्छता' },
  'reporterType.public': { en: 'Public', hi: 'जनता' },
  
  // Staff Audit Reports translations
  'staffAudit.title': { en: 'Staff Sanitation Audit Reports', hi: 'स्टाफ स्वच्छता ऑडिट रिपोर्ट' },
  'staffAudit.subtitle': { en: 'Monitor and track all staff sanitation audit activities in real-time', hi: 'सभी स्टाफ स्वच्छता ऑडिट गतिविधियों को वास्तविक समय में मॉनिटर और ट्रैक करें' },
  'staffAudit.totalReports': { en: 'Total Reports', hi: 'कुल रिपोर्ट' },
  'staffAudit.live': { en: 'Live', hi: 'लाइव' },
  'staffAudit.filterReports': { en: 'Filter Reports', hi: 'रिपोर्ट फ़िल्टर करें' },
  'staffAudit.searchPlaceholder': { en: 'Search by location, staff, or facility ID...', hi: 'स्थान, कर्मचारी, या सुविधा आईडी द्वारा खोजें...' },
  'staffAudit.filterByStaff': { en: 'Filter by staff sanitation', hi: 'स्टाफ स्वच्छता द्वारा फ़िल्टर करें' },
  'staffAudit.filterByStatus': { en: 'Filter by status', hi: 'स्थिति द्वारा फ़िल्टर करें' },
  'staffAudit.allStaff': { en: 'All Staff Sanitation', hi: 'सभी स्टाफ स्वच्छता' },
  'staffAudit.allStatus': { en: 'All Status', hi: 'सभी स्थिति' },
  'staffAudit.recentReports': { en: 'Recent Audit Reports', hi: 'हाल की ऑडिट रिपोर्ट' },
  'staffAudit.noReports': { en: 'No audit reports found matching your criteria.', hi: 'आपके मानदंडों से मेल खाने वाली कोई ऑडिट रिपोर्ट नहीं मिली।' },
  'staffAudit.facilityId': { en: 'Facility ID', hi: 'सुविधा आईडी' },
  'staffAudit.staff': { en: 'Staff Sanitation', hi: 'स्टाफ स्वच्छता' },
  'staffAudit.issues': { en: 'Issues', hi: 'समस्याएं' },
  'staffAudit.notes': { en: 'Notes', hi: 'नोट्स' },
  'staffAudit.issuesFound': { en: 'Issues Found', hi: 'समस्याएं मिलीं' },
  'staffAudit.photos': { en: 'Photos', hi: 'फोटो' },
  'staffAudit.photosCount': { en: 'photos', hi: 'फोटो' },
  'staffAudit.viewPhotos': { en: 'View', hi: 'देखें' },
  'staffAudit.noPhotos': { en: 'No Photos', hi: 'कोई फोटो नहीं' },
  'staffAudit.noPhotosDescription': { en: 'This audit was submitted without photos', hi: 'यह ऑडिट बिना फोटो के जमा किया गया था' },
  'staffAudit.auditPhotos': { en: 'Audit Photos', hi: 'ऑडिट फोटो' },
  'staffAudit.auditPhoto': { en: 'Audit Photo', hi: 'ऑडिट फोटो' },
  'staffAudit.photo': { en: 'Photo', hi: 'फोटो' },
  'staffAudit.clickToDownload': { en: 'Click to download', hi: 'डाउनलोड करने के लिए क्लिक करें' },
  'staffAudit.totalPhotos': { en: 'Total Photos', hi: 'कुल फोटो' },
  'staffAudit.newAuditReceived': { en: 'New audit received from', hi: 'नया ऑडिट प्राप्त हुआ' },
  'staffAudit.at': { en: 'at', hi: 'पर' },

  // Priority translations
  'priority.high': { en: 'HIGH', hi: 'उच्च' },
  'priority.medium': { en: 'MEDIUM', hi: 'मध्यम' },
  'priority.low': { en: 'LOW', hi: 'निम्न' },

  // Action buttons
  'action.view': { en: 'View', hi: 'देखें' },
  'action.complete': { en: 'पूर्ण करें', hi: 'पूर्ण करें' },
  'action.completed': { en: '✓ Completed', hi: '✓ पूर्ण' },

  // Staff Management
  'staff.title': { en: 'Staff Sanitation Management', hi: 'स्टाफ स्वच्छता प्रबंधन' },
  'staff.subtitle': { en: 'Manage your sanitation staff and their assignments', hi: 'अपने स्वच्छता कर्मचारियों और उनके कार्यों का प्रबंधन करें' },
  'staff.addStaff': { en: 'Add Staff Sanitation Member', hi: 'स्टाफ स्वच्छता सदस्य जोड़ें' },
  'staff.activeStaff': { en: 'Active Staff Sanitation', hi: 'सक्रिय स्टाफ स्वच्छता' },
  'staff.cleaners': { en: 'Cleaners', hi: 'सफाई कर्मचारी' },
  'staff.supervisors': { en: 'Supervisors', hi: 'पर्यवेक्षक' },
  'staff.maintenance': { en: 'Maintenance', hi: 'रखरखाव' },

  // Facility Registry
  'facility.title': { en: 'Facility Registry', hi: 'सुविधा रजिस्ट्री' },
  'facility.subtitle': { en: 'Monitor and manage all public facilities', hi: 'सभी सार्वजनिक सुविधाओं की निगरानी और प्रबंधन करें' },
  'facility.totalFacilities': { en: 'Total Facilities', hi: 'कुल सुविधाएं' },
  'facility.liveStatus': { en: 'Live Status', hi: 'लाइव स्थिति' },

  // Messages
  'message.reportSubmitted': { en: 'Report submitted successfully! Admin will review your report.', hi: 'रिपोर्ट सफलतापूर्वक जमा की गई! एडमिन आपकी रिपोर्ट की समीक्षा करेगा।' },
  'message.qrScanned': { en: 'Report marked as completed and added to audit logs!', hi: 'रिपोर्ट पूर्ण के रूप में चिह्नित और ऑडिट लॉग में जोड़ी गई!' },
  'message.statusUpdated': { en: 'Facility status updated', hi: 'सुविधा की स्थिति अपडेट की गई' },

  // Language
  'language.english': { en: 'English', hi: 'अंग्रेजी' },
  'language.hindi': { en: 'Hindi', hi: 'हिंदी' },
  'language.selectLanguage': { en: 'Select Language', hi: 'भाषा चुनें' },

  // Additional staff translations
  'staff.volunteerReportsManagement': { en: 'Volunteer Reports Management', hi: 'स्वयंसेवक रिपोर्ट प्रबंधन' },
  'staff.reviewManageReports': { en: 'Review and manage reports submitted by volunteers', hi: 'स्वयंसेवकों द्वारा सबमिट की गई रिपोर्ट की समीक्षा और प्रबंधन करें' },
  'staff.allVolunteerReports': { en: 'All Volunteer Reports', hi: 'सभी स्वयंसेवक रिपोर्ट' },
  'staff.noVolunteerReportsFound': { en: 'No volunteer reports found', hi: 'कोई स्वयंसेवक रिपोर्ट नहीं मिली' },
  'staff.reportsSubmittedByVolunteers': { en: 'Reports submitted by volunteers will appear here', hi: 'स्वयंसेवकों द्वारा सबमिट की गई रिपोर्ट यहां दिखाई देंगी' },
  'staff.complete': { en: 'Complete', hi: 'पूर्ण करें' },
  'staff.scanQRToComplete': { en: 'Scan QR Code to Complete', hi: 'पूर्ण करने के लिए क्यूआर कोड स्कैन करें' },
  'staff.scanningQR': { en: 'Scanning QR code...', hi: 'क्यूआर कोड स्कैन हो रहा है...' },
  'staff.clickToScan': { en: 'Click the button below to start scanning', hi: 'स्कैनिंग शुरू करने के लिए नीचे दिए गए बटन पर क्लिक करें' },
  'staff.startQRScan': { en: 'Start QR Scan', hi: 'क्यूआर स्कैन शुरू करें' },
  'staff.scanning': { en: 'Scanning...', hi: 'स्कैन हो रहा है...' },

  // Additional common translations
  'common.id': { en: 'ID', hi: 'आईडी' },
  'common.titleDescription': { en: 'Title & Description', hi: 'शीर्षक और विवरण' },
  'common.reporter': { en: 'Reporter', hi: 'रिपोर्टर' },
  'common.photo': { en: 'Photo', hi: 'फोटो' },
  'common.dateTime': { en: 'Date & Time', hi: 'दिनांक और समय' },
  'common.status': { en: 'Status', hi: 'स्थिति' },
  'common.actions': { en: 'Actions', hi: 'कार्य' },
  'common.by': { en: 'By', hi: 'द्वारा' },
  'common.of': { en: 'of', hi: 'का' },
  'common.close': { en: 'Close', hi: 'बंद करें' },
  'common.clear': { en: 'Clear', hi: 'साफ़ करें' },
  'common.more': { en: 'more', hi: 'और' },
  'common.saved': { en: 'saved', hi: 'सहेजा गया' },
  'common.details': { en: 'Details', hi: 'विवरण' },
  'common.name': { en: 'Name', hi: 'नाम' },
  'common.email': { en: 'Email', hi: 'ईमेल' },
  'common.phone': { en: 'Phone', hi: 'फोन' },
  'common.role': { en: 'Role', hi: 'भूमिका' },
  'common.address': { en: 'Address', hi: 'पता' },
  'common.capacity': { en: 'Capacity', hi: 'क्षमता' },
  'common.notes': { en: 'Notes', hi: 'टिप्पणियाँ' },
  'common.today': { en: 'Today', hi: 'आज' },
  'common.yesterday': { en: 'Yesterday', hi: 'कल' },
  'common.thisWeek': { en: 'This Week', hi: 'इस सप्ताह' },
  'common.thisMonth': { en: 'This Month', hi: 'इस महीने' },
  'common.title': { en: 'Title', hi: 'शीर्षक' },
  'common.description': { en: 'Description', hi: 'विवरण' },
  'common.back': { en: 'Back', hi: 'वापस' },

  // Dashboard translations
  'dashboard.title': { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  'dashboard.subtitle': { en: 'Monitor and manage all system activities', hi: 'सभी सिस्टम गतिविधियों की निगरानी और प्रबंधन करें' },
  'dashboard.totalAudits': { en: 'Total Audits', hi: 'कुल ऑडिट' },
  'dashboard.completedAudits': { en: 'Completed Audits', hi: 'पूर्ण ऑडिट' },
  'dashboard.issuesFound': { en: 'Issues Found', hi: 'समस्याएं मिलीं' },
  'dashboard.activeStaff': { en: 'Active Staff Sanitation', hi: 'सक्रिय स्टाफ स्वच्छता' },
  'dashboard.todayAudits': { en: "Today's Audits", hi: 'आज के ऑडिट' },
  'dashboard.todayCompleted': { en: "Today's Completed", hi: 'आज पूर्ण हुए' },
  'dashboard.auditCompletionRate': { en: 'Audit Completion Rate', hi: 'ऑडिट पूर्णता दर' },
  'dashboard.facilityCoverage': { en: 'Facility Coverage', hi: 'सुविधा कवरेज' },
  'dashboard.staffPerformanceOverview': { en: 'Staff Sanitation Performance Overview', hi: 'स्टाफ स्वच्छता प्रदर्शन अवलोकन' },
  'dashboard.recentAuditActivity': { en: 'Recent Audit Activity', hi: 'हाल की ऑडिट गतिविधि' },
  'dashboard.systemPerformanceMetrics': { en: 'System Performance Metrics', hi: 'सिस्टम प्रदर्शन मेट्रिक्स' },
  'dashboard.lastAudit': { en: 'Last audit', hi: 'अंतिम ऑडिट' },
  'dashboard.noStaffPerformanceData': { en: 'No staff sanitation performance data available', hi: 'कोई स्टाफ स्वच्छता प्रदर्शन डेटा उपलब्ध नहीं है' },
  'dashboard.noAuditDataAvailable': { en: 'No staff sanitation audit data available yet.', hi: 'अभी तक कोई स्टाफ स्वच्छता ऑडिट डेटा उपलब्ध नहीं है।' },

  // QR Confirmation translations
  'qraudit.title': { en: 'QR Code Confirmation', hi: 'क्यूआर कोड पुष्टि' },
  'qraudit.subtitle': { en: 'Scan facility QR codes to confirm cleaning completion', hi: 'सफाई पूर्णता की पुष्टि के लिए सुविधा क्यूआर कोड स्कैन करें' },
  'qraudit.scanQR': { en: 'Scan QR Code', hi: 'क्यूआर कोड स्कैन करें' },
  'qraudit.selectStaff': { en: 'Select Staff Sanitation Member', hi: 'स्टाफ स्वच्छता सदस्य चुनें' },
  'qraudit.staffMember': { en: 'Staff Sanitation Member', hi: 'स्टाफ स्वच्छता सदस्य' },
  'qraudit.enterStaffId': { en: 'Enter your staff sanitation ID', hi: 'अपनी स्टाफ स्वच्छता आईडी दर्ज करें' },
  'qraudit.cleaningType': { en: 'Cleaning Type', hi: 'सफाई का प्रकार' },
  'qraudit.selectCleaningType': { en: 'Select cleaning type', hi: 'सफाई का प्रकार चुनें' },
  'qraudit.routine': { en: 'Routine', hi: 'नियमित' },
  'qraudit.deep': { en: 'Deep', hi: 'गहरी' },
  'qraudit.emergency': { en: 'Emergency', hi: 'आपातकालीन' },
  'qraudit.enterNotes': { en: 'Enter any notes or observations', hi: 'कोई भी नोट्स या अवलोकन दर्ज करें' },
  'qraudit.submitAudit': { en: 'Submit Confirmation', hi: 'पुष्टि जमा करें' },
  'qraudit.submittingAudit': { en: 'Submitting Confirmation...', hi: 'पुष्टि जमा हो रहा है...' },
  'qraudit.selectType': { en: 'Select type', hi: 'प्रकार चुनें' },
  'qraudit.noRecentAudits': { en: 'No recent confirmations', hi: 'कोई हाल की पुष्टि नहीं' },
  'qraudit.submitFirstAudit': { en: 'Submit your first confirmation to see it here', hi: 'यहाँ देखने के लिए अपनी पहली पुष्टि जमा करें' },
  'qraudit.loggedInStaff': { en: 'Logged In', hi: 'लॉग इन' },
  'qraudit.staffAutoSelected': { en: 'Staff sanitation member automatically selected based on your login', hi: 'आपके लॉगिन के आधार पर स्टाफ स्वच्छता सदस्य स्वचालित रूप से चुना गया' },
  'qraudit.routineCleaning': { en: 'Routine Cleaning', hi: 'नियमित सफाई' },
  'qraudit.deepCleaning': { en: 'Deep Cleaning', hi: 'गहरी सफाई' },
  'qraudit.maintenance': { en: 'Maintenance', hi: 'रखरखाव' },
  'qraudit.issuesFound': { en: 'Issues Found', hi: 'समस्याएं मिलीं' },
  'qraudit.describeIssues': { en: 'Describe any issues found during cleaning...', hi: 'सफाई के दौरान मिली किसी भी समस्या का वर्णन करें...' },
  'qraudit.additionalNotes': { en: 'Additional Notes', hi: 'अतिरिक्त टिप्पणियाँ' },
  'qraudit.additionalObservations': { en: 'Any additional observations or comments...', hi: 'कोई अतिरिक्त अवलोकन या टिप्पणियाँ...' },
  'qraudit.quickDemo': { en: 'Quick Demo:', hi: 'त्वरित डेमो:' },
  'qraudit.fillSampleData': { en: 'Fill Sample Data', hi: 'नमूना डेटा भरें' },
  'qraudit.scanning': { en: 'Scanning...', hi: 'स्कैन हो रहा है...' },
  'qraudit.auditForm': { en: 'Confirmation Form', hi: 'पुष्टि फॉर्म' },
  'qraudit.cleaningAuditForm': { en: 'Cleaning Confirmation Form', hi: 'सफाई पुष्टि फॉर्म' },
  'qraudit.photos': { en: 'Photos', hi: 'फोटो' },
  'qraudit.takePhotos': { en: 'Take Photos', hi: 'फोटो लें' },
  'qraudit.qrCodeScanner': { en: 'QR Code Scanner', hi: 'QR कोड स्कैनर' },
  'qraudit.openCamera': { en: 'Open Camera', hi: 'कैमरा खोलें' },
  'qraudit.demoMode': { en: 'Demo Mode', hi: 'डेमो मोड' },

  // Scanner translations
  'scanner.title': { en: 'QR Scanner', hi: 'क्यूआर स्कैनर' },
  'scanner.subtitle': { en: 'Scan a QR code to report sanitation issues', hi: 'स्वच्छता समस्याओं की रिपोर्ट करने के लिए क्यूआर कोड स्कैन करें' },
  'scanner.startScan': { en: 'Start Scan', hi: 'स्कैन शुरू करें' },
  'scanner.scanning': { en: 'Scanning...', hi: 'स्कैन हो रहा है...' },
  'scanner.positionQR': { en: 'Position QR code within the frame', hi: 'क्यूआर कोड को फ्रेम के भीतर रखें' },
  'scanner.demoMode': { en: 'Demo Mode', hi: 'डेमो मोड' },
  'scanner.demoDescription': { en: 'This is a demonstration scanner. Click "Start Scan" to proceed to the report form.', hi: 'यह एक प्रदर्शन स्कैनर है। रिपोर्ट फॉर्म पर जाने के लिए "स्कैन शुरू करें" पर क्लिक करें।' },
  'scanner.openCamera': { en: 'Open Camera', hi: 'कैमरा खोलें' },
  'scanner.scanQR': { en: 'Scan QR Code', hi: 'QR कोड स्कैन करें' },
  'scanner.cameraActive': { en: 'Camera Active', hi: 'कैमरा सक्रिय' },
  'scanner.cameraInfo': { en: 'Camera Access', hi: 'कैमरा एक्सेस' },
  'scanner.cameraActiveDesc': { en: 'Point your camera at the QR code to scan it automatically.', hi: 'इसे स्वचालित रूप से स्कैन करने के लिए अपना कैमरा QR कोड पर इंगित करें।' },
  'scanner.cameraInfoDesc': { en: 'Click "Open Camera" to use real camera or "Demo Mode" for simulation.', hi: 'वास्तविक कैमरा उपयोग करने के लिए "कैमरा खोलें" या सिमुलेशन के लिए "डेमो मोड" पर क्लिक करें।' },

  // Photo Capture translations
  'photo.title': { en: 'Photo Capture', hi: 'फोटो कैप्चर' },
  'photo.cameraPreview': { en: 'Camera preview will appear here', hi: 'कैमरा पूर्वावलोकन यहाँ दिखाई देगा' },
  'photo.openCamera': { en: 'Open Camera', hi: 'कैमरा खोलें' },
  'photo.takePhoto': { en: 'Take Photo', hi: 'फोटो लें' },
  'photo.capturedPhotos': { en: 'Captured Photos', hi: 'कैप्चर की गई फोटो' },
  'photo.photo': { en: 'Photo', hi: 'फोटो' },
  'photo.savePhotos': { en: 'Save Photos', hi: 'फोटो सेव करें' },
  'photo.cameraError': { en: 'Unable to access camera. Please check permissions.', hi: 'कैमरा एक्सेस नहीं कर सकते। कृपया अनुमतियाँ जांचें।' },

  // Staff Management translations
  'staffMgmt.title': { en: 'Staff Sanitation Management', hi: 'स्टाफ स्वच्छता प्रबंधन' },
  'staffMgmt.subtitle': { en: 'Manage all staff sanitation members, roles, and assignments', hi: 'सभी स्टाफ स्वच्छता सदस्यों, भूमिकाओं और असाइनमेंट का प्रबंधन करें' },
  'staffMgmt.addStaffMember': { en: 'Add Staff Sanitation Member', hi: 'स्टाफ स्वच्छता सदस्य जोड़ें' },
  'staffMgmt.searchByNameEmail': { en: 'Search by name, email, or phone...', hi: 'नाम, ईमेल या फोन द्वारा खोजें...' },
  'staffMgmt.filterByRole': { en: 'Filter by Role', hi: 'भूमिका द्वारा फ़िल्टर करें' },
  'staffMgmt.allRoles': { en: 'All Roles', hi: 'सभी भूमिकाएँ' },
  'staffMgmt.allStatus': { en: 'All Status', hi: 'सभी स्थिति' },
  'staffMgmt.cleaner': { en: 'Cleaner', hi: 'सफाईकर्मी' },
  'staffMgmt.supervisor': { en: 'Supervisor', hi: 'पर्यवेक्षक' },
  'staffMgmt.maintenance': { en: 'Maintenance', hi: 'रखरखाव' },
  'staffMgmt.fillRequiredFields': { en: 'Please fill in all required fields', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें' },
  'staffMgmt.staffAdded': { en: 'Staff member {name} added successfully!', hi: 'कर्मचारी {name} सफलतापूर्वक जोड़ा गया!' },
  'staffMgmt.staffUpdated': { en: 'Staff member {name} updated successfully!', hi: 'कर्मचारी {name} सफलतापूर्वक अपडेट किया गया!' },
  'staffMgmt.confirmDelete': { en: 'Are you sure you want to delete {name}?', hi: 'क्या आप वाकई {name} को हटाना चाहते हैं?' },
  'staffMgmt.staffDeleted': { en: 'Staff member {name} deleted successfully!', hi: 'कर्मचारी {name} सफलतापूर्वक हटाया गया!' },
  'staffMgmt.totalStaff': { en: 'Total Staff', hi: 'कुल कर्मचारी' },
  'staffMgmt.active': { en: 'Active', hi: 'सक्रिय' },
  'staffMgmt.activeStaff': { en: 'Active Staff', hi: 'सक्रिय कर्मचारी' },
  'staffMgmt.cleaners': { en: 'Cleaners', hi: 'सफाईकर्मी' },
  'staffMgmt.supervisors': { en: 'Supervisors', hi: 'पर्यवेक्षक' },
  'staffMgmt.filterStaff': { en: 'Filter Staff', hi: 'कर्मचारी फ़िल्टर करें' },
  'staffMgmt.staffMembers': { en: 'Staff Members', hi: 'कर्मचारी सदस्य' },
  'staffMgmt.noStaffFound': { en: 'No staff members found', hi: 'कोई कर्मचारी सदस्य नहीं मिले' },
  'staffMgmt.adjustFilters': { en: 'Try adjusting your search or filters', hi: 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें' },
  'staffMgmt.addFirstStaff': { en: 'Add your first staff member to get started', hi: 'शुरुआत करने के लिए अपना पहला कर्मचारी सदस्य जोड़ें' },
  'staffMgmt.filterByStatus': { en: 'Filter by Status', hi: 'स्थिति द्वारा फ़िल्टर करें' },
  'staffMgmt.onLeave': { en: 'On Leave', hi: 'छुट्टी पर' },
  'staffMgmt.allStaffMembers': { en: 'All Staff Members', hi: 'सभी स्टाफ सदस्य' },
  'staffMgmt.noStaffMembersFound': { en: 'No staff members found matching your criteria.', hi: 'आपके मानदंड से मेल खाने वाले कोई स्टाफ सदस्य नहीं मिले।' },
  'staffMgmt.viewDetails': { en: 'View Details', hi: 'विवरण देखें' },
  'staffMgmt.staffDetails': { en: 'Staff Details', hi: 'स्टाफ विवरण' },
  'staffMgmt.shift': { en: 'Shift', hi: 'शिफ्ट' },
  'staffMgmt.morning': { en: 'Morning', hi: 'सुबह' },
  'staffMgmt.afternoon': { en: 'Afternoon', hi: 'दोपहर' },
  'staffMgmt.night': { en: 'Night', hi: 'रात' },
  'staffMgmt.assignedAreas': { en: 'Assigned Areas', hi: 'निर्धारित क्षेत्र' },
  'staffMgmt.emergencyContact': { en: 'Emergency Contact', hi: 'आपातकालीन संपर्क' },
  'staffMgmt.joinDate': { en: 'Join Date', hi: 'शामिल होने की तिथि' },
  'staffMgmt.profileImage': { en: 'Profile Image', hi: 'प्रोफ़ाइल छवि' },
  'staffMgmt.updateStaff': { en: 'Update Staff', hi: 'स्टाफ अपडेट करें' },
  'staffMgmt.addNewStaffMember': { en: 'Add New Staff Member', hi: 'नया स्टाफ सदस्य जोड़ें' },
  'staffMgmt.addStaff': { en: 'Add Staff', hi: 'स्टाफ जोड़ें' },

  // Facility Management translations
  'facilityMgmt.title': { en: 'Facility Registry', hi: 'सुविधा रजिस्ट्री' },
  'facilityMgmt.subtitle': { en: 'Monitor and manage all public facilities', hi: 'सभी सार्वजनिक सुविधाओं की निगरानी और प्रबंधन करें' },
  'facilityMgmt.totalFacilities': { en: 'Total Facilities', hi: 'कुल सुविधाएँ' },
  'facilityMgmt.operational': { en: 'Operational', hi: 'परिचालन में' },
  'facilityMgmt.outOfOrder': { en: 'Out of Order', hi: 'खराब' },
  'facilityMgmt.filterByLocation': { en: 'Filter by Location', hi: 'स्थान द्वारा फ़िल्टर करें' },
  'facilityMgmt.allLocations': { en: 'All Locations', hi: 'सभी स्थान' },
  'facilityMgmt.searchByNameLocationID': { en: 'Search by name, location, or ID...', hi: 'नाम, स्थान या आईडी द्वारा खोजें...' },
  'facilityMgmt.noFacilitiesFound': { en: 'No facilities found', hi: 'कोई सुविधा नहीं मिली' },
  'facilityMgmt.tryAdjustingSearch': { en: 'Try adjusting your search or filters', hi: 'अपनी खोज या फ़िल्टर समायोजित करने का प्रयास करें' },
  'facilityMgmt.facilityDetails': { en: 'Facility Details', hi: 'सुविधा विवरण' },
  'facilityMgmt.cleaningFrequency': { en: 'Cleaning Frequency', hi: 'सफाई आवृत्ति' },
  'facilityMgmt.qrCode': { en: 'QR Code', hi: 'क्यूआर कोड' },
  'facilityMgmt.facilities': { en: 'Facilities', hi: 'सुविधाएँ' },
  'facilityMgmt.male': { en: 'Male', hi: 'पुरुष' },
  'facilityMgmt.female': { en: 'Female', hi: 'महिला' },
  'facilityMgmt.disabledAccess': { en: 'Disabled Access', hi: 'विकलांग पहुंच' },
  'facilityMgmt.babyChanging': { en: 'Baby Changing', hi: 'बेबी चेंजिंग' },
  'facilityMgmt.shower': { en: 'Shower', hi: 'शॉवर' },
  'facilityMgmt.familyRoom': { en: 'Family Room', hi: 'परिवार कक्ष' },
  'facilityMgmt.medicalWaste': { en: 'Medical Waste', hi: 'चिकित्सा अपशिष्ट' },
  'facilityMgmt.childFriendly': { en: 'Child-Friendly', hi: 'बाल-अनुकूल' },
  'facilityMgmt.updateStatus': { en: 'Update Status', hi: 'स्थिति अपडेट करें' },
  'facilityMgmt.liveStatus': { en: 'Live Status', hi: 'लाइव स्थिति' },
  'facilityMgmt.gpsCoordinates': { en: 'GPS Coordinates', hi: 'जीपीएस निर्देशांक' },
  'facilityMgmt.staffAssigned': { en: 'Staff Assigned', hi: 'स्टाफ असाइन किया गया' },
  'facilityMgmt.lastCleaned': { en: 'Last Cleaned', hi: 'अंतिम बार साफ किया गया' },
  'facilityMgmt.statusUpdated': { en: 'Facility status updated to {status}', hi: 'सुविधा स्थिति {status} में अपडेट की गई' },
  'facilityMgmt.noStaffAssigned': { en: 'No staff assigned', hi: 'कोई स्टाफ असाइन नहीं किया गया' },
  'facilityMgmt.noFacilitiesAvailable': { en: 'No facilities available', hi: 'कोई सुविधा उपलब्ध नहीं' },
  'facilityMgmt.filterFacilities': { en: 'Filter Facilities', hi: 'सुविधाएं फ़िल्टर करें' },
  'facilityMgmt.facilityRegistry': { en: 'Facility Registry', hi: 'सुविधा रजिस्ट्री' },
  'facilityMgmt.nameLocation': { en: 'Name & Location', hi: 'नाम और स्थान' },
  'facilityMgmt.details': { en: 'Details', hi: 'विवरण' },
  'facilityMgmt.actions': { en: 'Actions', hi: 'कार्य' },
  'facilityMgmt.facilityId': { en: 'Facility ID', hi: 'सुविधा आईडी' },
  'facilityMgmt.capacity': { en: 'Capacity', hi: 'क्षमता' },
  'facilityMgmt.people': { en: 'people', hi: 'लोग' },
  'facilityMgmt.address': { en: 'Address', hi: 'पता' },
  'facilityMgmt.availableFacilities': { en: 'Available Facilities', hi: 'उपलब्ध सुविधाएं' },
  'facilityMgmt.assignedStaff': { en: 'Assigned Staff', hi: 'असाइन किया गया स्टाफ' },
  'facilityMgmt.view': { en: 'View', hi: 'देखें' },
  'facilityMgmt.addFacility': { en: 'Add Facility', hi: 'सुविधा जोड़ें' },
  'facilityMgmt.addNewFacility': { en: 'Add New Facility', hi: 'नई सुविधा जोड़ें' },
  'facilityMgmt.facilityName': { en: 'Facility Name', hi: 'सुविधा का नाम' },
  'facilityMgmt.enterFacilityName': { en: 'Enter facility name', hi: 'सुविधा का नाम दर्ज करें' },
  'facilityMgmt.enterLocation': { en: 'Enter location', hi: 'स्थान दर्ज करें' },
  'facilityMgmt.enterAddress': { en: 'Enter full address', hi: 'पूरा पता दर्ज करें' },
  'facilityMgmt.enterCapacity': { en: 'Enter capacity', hi: 'क्षमता दर्ज करें' },
  'facilityMgmt.enterQRCode': { en: 'Enter QR code', hi: 'क्यूआर कोड दर्ज करें' },
  'facilityMgmt.selectCleaningFreq': { en: 'Select cleaning frequency', hi: 'सफाई आवृत्ति चुनें' },
  'facilityMgmt.selectFacilities': { en: 'Select available facilities', hi: 'उपलब्ध सुविधाएं चुनें' },
  'facilityMgmt.selectStaff': { en: 'Select assigned staff', hi: 'असाइन किया गया स्टाफ चुनें' },
  'facilityMgmt.hourly': { en: 'Hourly', hi: 'प्रति घंटा' },
  'facilityMgmt.daily': { en: 'Daily', hi: 'दैनिक' },
  'facilityMgmt.weekly': { en: 'Weekly', hi: 'साप्ताहिक' },
  'facilityMgmt.facilityAdded': { en: 'Facility {name} added successfully!', hi: 'सुविधा {name} सफलतापूर्वक जोड़ी गई!' },
  'facilityMgmt.facilityUpdated': { en: 'Facility {name} updated successfully!', hi: 'सुविधा {name} सफलतापूर्वक अपडेट की गई!' },
  'facilityMgmt.editFacility': { en: 'Edit Facility', hi: 'सुविधा संपादित करें' },
  'facilityMgmt.fillAllFields': { en: 'Please fill in all required fields', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें' },

  
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};