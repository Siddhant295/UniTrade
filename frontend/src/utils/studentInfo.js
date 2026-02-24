export const getStudentInfo = (email) => {
    if (!email || !email.includes('@iiit-bh.ac.in')) {
        return { branch: 'Unknown', batch: 'Unknown', year: 'Unknown' };
    }

    const rollPart = email.split('@')[0].toLowerCase();

    // Example: b421050
    // b = BTech
    // 4 = Branch (1: CSE, 2: CE, 3: ETC, 4: IT, 5: EEE)
    // 21 = Batch

    const branchCode = rollPart.charAt(1);
    const batchCode = rollPart.substring(2, 4);

    const branches = {
        '1': 'Computer Science & Engineering',
        '2': 'Civil Engineering',
        '3': 'Electronics & Telecommunication',
        '4': 'Information Technology',
        '5': 'Electrical & Electronics Engineering'
    };

    const branch = branches[branchCode] || 'General';
    const startYear = 2000 + parseInt(batchCode);
    const endYear = startYear + 4;
    const batch = `${startYear}-${endYear}`;

    // Calculate current year (simple logic)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // 0-indexed

    let yearOfStudy = currentYear - startYear;
    if (currentMonth >= 6) yearOfStudy += 1; // Assuming academic year starts in July

    const yearNames = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
    const studyYear = yearNames[yearOfStudy - 1] || 'Alumni';

    return {
        branch,
        batch,
        studyYear
    };
};
