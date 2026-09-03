# EchoDesk

## Real Time AI Captioning for Inclusive University Classrooms

EchoDesk is an AI powered accessibility platform designed to help deaf and hard of hearing students participate more fully in university lectures.

It converts a lecturer's speech into near real time captions, allowing students to follow spoken lectures directly from their smartphones or other internet enabled devices without requiring a dedicated app or expensive classroom infrastructure.

## The Problem

For many deaf and hard of hearing students, being physically present in a classroom does not always mean having equal access to the lecture.

Spoken explanations, discussions, questions, and responses can be difficult to follow when:

1. Sign language interpreters are unavailable
2. Real time captioning systems are expensive or unavailable
3. Students have to depend on classmates for notes
4. Existing accessibility infrastructure is limited

This can create an unnecessary gap between students and the academic content being delivered.

EchoDesk aims to bridge that gap using AI.

## The Solution

EchoDesk provides a simple workflow.

```text
Lecturer
    |
    v
Starts a Lecture Session
    |
    v
Speaks Normally
    |
    v
AI Speech Recognition
    |
    v
Real Time Captions
    |
    v
Students Read on Their Devices
```

A lecturer starts a session and receives a session code.

Students join the session using their devices and can read the lecturer's speech as captions while the lecture is happening.

After the lecture, the transcript can also be used to create additional learning resources such as summaries and practice questions.

## Key Features

### Real Time Speech to Text

Converts spoken lectures into text with minimal delay using Automatic Speech Recognition.

### No App Installation

Students can access captions through a web based interface using devices they already own.

### Lecture Session Codes

Lecturers can create a session and share a simple code with students.

### Live Captions

Students can follow spoken classroom content as it happens.

### AI Powered Learning Support

Lecture transcripts can be processed by AI to generate:

1. Lecture summaries
2. Practice questions
3. Revision materials

### Accessibility First Design

The platform is designed around the needs of deaf and hard of hearing students.

### Designed for Nigerian Universities

EchoDesk focuses on affordability, accessibility, and deployment in environments where specialized accessibility infrastructure may be limited.

## How AI Is Used

AI is at the core of EchoDesk.

### Automatic Speech Recognition

The lecturer's speech is captured and processed by an AI speech recognition model.

```text
Audio
    |
    v
Speech Recognition
    |
    v
Text
```

The resulting text is then streamed to connected students.

### Speech Processing

Audio preprocessing can be applied before transcription to improve the quality of speech captured in noisy classroom environments.

### Generative AI

After a lecture, the generated transcript can be processed by a Large Language Model to produce useful learning materials such as summaries and practice questions.

```text
Lecture Transcript
        |
        v
       LLM
     /  |  \
    /   |   \
Summary Questions Revision Notes
```

## System Architecture

The current EchoDesk prototype explores an architecture built around local speech processing and low connectivity environments.

```text
                    Lecturer
                       |
                       v
                 Microphone
                       |
                       v
              Audio Processing
                       |
                       v
                  Whisper ASR
                       |
                       v
                Live Transcript
                       |
                       v
                Student Devices
                       |
                       v
                 Live Captions
```

The prototype also explores local communication and offline capable processing, helping reduce dependence on continuous internet connectivity.

## Technology Stack

EchoDesk uses or explores technologies including:

1. Python for AI and backend development
2. Whisper and Whisper GGUF for Automatic Speech Recognition
3. Large Language Models for summarization and learning support
4. MATLAB for audio preprocessing and signal processing research
5. Web technologies for student and lecturer interfaces
6. Local networking for low connectivity communication

## Prototype Research

EchoDesk's audio processing prototype explored techniques for improving speech quality before transcription.

Using acoustic preprocessing, the prototype achieved an observed Signal to Noise Ratio improvement of approximately 3.35 dB under the tested conditions.

This work supports the broader goal of making speech recognition more reliable in real classroom environments where background noise can affect transcription quality.

## Target Users

### Primary Users

Deaf and hard of hearing university students.

Students can access live lecture captions from their personal devices.

### Secondary Users

Lecturers can make their classes more accessible without requiring specialized captioning equipment.

Universities can use EchoDesk as a scalable accessibility layer across classrooms.

## Potential Impact

EchoDesk aims to make university education more inclusive by reducing the accessibility barrier faced by deaf and hard of hearing students.

Potential impact includes:

1. Improved access to spoken lectures
2. Greater classroom participation
3. Reduced dependence on scarce accessibility resources
4. More accessible lecture materials
5. AI assisted revision and learning
6. A scalable accessibility solution for universities

The long term vision is to make accessibility an integrated part of the classroom rather than an additional service that is only available in some situations.

## Roadmap

### Phase 1

1. Speech to text pipeline
2. Audio preprocessing research
3. Real time captioning concept
4. Student and lecturer workflow

### Phase 2

1. Stable web interface
2. Lecture session management
3. Student session joining
4. Improved real time streaming
5. Transcript storage

### Phase 3

1. Automatic lecture summaries
2. Practice question generation
3. Searchable lecture transcripts
4. Personalized revision support

### Phase 4

1. Classroom pilot
2. Accessibility testing with target users
3. University partnerships
4. Performance optimization for low connectivity environments
5. Scaling across multiple institutions

## Privacy and Accessibility

EchoDesk is designed with accessibility and responsible AI use in mind.

Future production deployments will prioritize:

1. Secure handling of lecture transcripts
2. Minimal collection of student data
3. Appropriate consent for audio recording
4. Transparent AI processing
5. Accessible user interfaces

## Contributing

Contributions, ideas, and feedback are welcome.

To contribute:

```bash
git clone https://github.com/YOUR_USERNAME/echodesk.git
cd echodesk
git checkout -b feature/your-feature
```

Make your changes, commit them, and submit a pull request.

## Project Structure

The project structure may evolve as EchoDesk moves from prototype to production.

```text
echodesk/
|
|   frontend/
|   Student and lecturer interfaces
|
|   backend/
|   API and session management
|
|   ai/
|   Speech recognition and AI processing
|
|   audio/
|   Audio processing utilities
|
|   models/
|   AI model configuration
|
|   docs/
|   Documentation
|
|   tests/
|   Automated tests
|
|   README.md
|   LICENSE
```

## Current Status

EchoDesk is currently in the prototype and MVP development stage.

The project is being developed toward real world deployment in university learning environments.

The goal is not simply to demonstrate AI speech recognition, but to turn it into a practical accessibility tool that can be used by students and lecturers.

## Built By

EchoDesk Team

Building with AI, accessibility, and inclusive education in mind.

## License

This project is currently under development.

License information will be added as the project moves toward public release.

## Support the Project

If you believe technology should make education more accessible, consider giving the project a star on GitHub and following its development.

**EchoDesk**

**Hear the lecture. Read the moment. Learn without barriers.**
