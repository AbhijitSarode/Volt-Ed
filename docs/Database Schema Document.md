## Database Schema Document

### Users Collection

- **firstName**: String (required)
- **lastName**: String (required)
- **email**: String (required)
- **password**: String (required)
- **accountType**: String (required, enum: ['Admin', 'Instructor', 'Student'])
- **active**: Boolean (default: true)
- **approved**: Boolean (default: false)
- **image**: String (required)
- **token**: String
- **resetPasswordExpires**: Date
- **Profile**: ObjectId referencing Profile collection (required)
- **Courses**: Array of ObjectIds referencing Course collection
- **courseProgress**: Array of ObjectIds referencing CourseProgress collection
- **createdAt**: Date (default: Date.now)

### Profile Collection

- **gender**: String (required)
- **dateOfBirth**: String (required)
- **about**: String (required)
- **contact**: String (required)

### OTP Collection

- **email**: String (required)
- **otp**: String (required)
- **createdAt**: Date (default: Date.now, expires: 300 seconds)

### Courses Collection

- **courseName**: String (required)
- **courseDescription**: String (required)
- **whatYouWillLearn**: String
- **price**: Number (required)
- **thumbnail**: String
- **tag**: Array of Strings (required)
- **instructor**: ObjectId referencing User collection (required)
- **courseContent**: Array of ObjectIds referencing Section collection
- **category**: ObjectId referencing Category collection
- **studentsEnrolled**: Array of ObjectIds referencing User collection

### Sections Collection (Topic)

- **sectionName**: String (required)
- **subSections**: Array of ObjectIds referencing SubSection collection (required)

### SubSections Collection (Lecture)

- **title**: String
- **description**: String
- **timeDuration**: String
- **videoUrl**: String
- **createdAt**: Date (default: Date.now)

### Categories Collection

- **name**: String (required)
- **description**: String (required)
- **courses**: Array of ObjectIds referencing Course collection

### Course Progress Collection

- **courseId**: ObjectId referencing Course collection
- **completedVideos**: Array of ObjectIds referencing SubSection collection

### Ratings and Reviews Collection

- **user**: ObjectId referencing User collection (required)
- **rating**: Number (required)
- **review**: String (required)
- **course**: ObjectId referencing Course collection (required)

### Indexes

- Index on `email` field in Users collection for faster user lookup.
- Index on `courseId` field in Course Progress collection for efficient course progress retrieval.

### Validation Rules

- **email**: Valid email format required in Users and OTP collections.
- **password**: Minimum length and complexity requirements enforced.

### Data Migration

- Considerations for migrating data when schema changes occur to ensure data integrity and consistency.

### Backup and Recovery

- Regular backups of the database to prevent data loss and enable recovery in case of failures.

### Data Retention Policy

- Guidelines for data retention and deletion to comply with privacy regulations and optimize storage usage.

### Data Encryption and Security Measures

- Encryption of sensitive data such as passwords and personal information to ensure confidentiality.

### Performance Tuning

- Optimizations such as query indexing and caching strategies for improving database performance.

### Scalability

- Strategies for scaling the database infrastructure to handle increased load and growing datasets.

### Monitoring and Maintenance

- Monitoring database health, performance metrics, and regular maintenance tasks like index optimizations and data compaction.

### Schema Evolution

- Guidelines for evolving the database schema over time to accommodate changing application requirements while minimizing disruptions.
