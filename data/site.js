/* =====================================================================
   SITE CONTENT — the only file you need to edit to update the portfolio.
   =====================================================================

   Text formatting (works in any text field below):
     *word*   → highlighted in the accent colour
     ~word~   → muted (softer grey) text
     \n       → line break

   Projects:
     tier: 'featured' → large card with a visual (top of the Work section)
           'more'     → small text card in "More work"
           'archive'  → card with thumbnail in the filterable "Archive"
     Give a project a `case` object and it gets its own page at
     project.html?id=<id>. Otherwise the card links to `link` (if any).

   Visuals (featured cards + case pages):
     { art: 'flow' | 'lidar' | 'variance' | 'terrain' }  generated drawings
     { image: 'assets/img/...', alt: '...' }             your own picture
   ===================================================================== */

window.SITE = {
  meta: {
    title: 'Abdul Aziz — Robotics Engineer',
    description:
      'Abdul Aziz — MS Robotics at Northeastern. Perception, SLAM, field robotics and embedded avionics.',
    url: 'https://azizxabd.github.io/',
  },

  theme: {
    accent: '#F5D547', // try '#7FE0C2', '#FF9E7A' or '#E8EEEA'
    mode: 'auto',      // 'auto' (follows the visitor's system) | 'dark' | 'light'
  },

  person: {
    name: 'Abdul Aziz',
    email: 'aziz.abd@northeastern.edu',
    resume: 'assets/docs/Abdul_Aziz_CV.pdf', // set to '' to hide the Résumé button
    portrait: { src: 'assets/img/me/profile.webp', alt: 'Abdul Aziz' },
    availability: 'Graduating May 2027 · open to full-time robotics roles',
  },

  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/xziz' },
    { label: 'GitHub', url: 'https://github.com/Awwziz' },
  ],

  // Order of sections on the home page. Remove or reorder freely.
  sections: ['hero', 'statement', 'featured', 'more', 'archive', 'about', 'recognition', 'toolkit', 'contact'],

  nav: [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Robotics engineer · Perception & control · Boston',
    title: 'Robots that know where they are.',
    lede:
      'I build perception, control and teleoperation software for real robots — currently a UR arm and a PSYONIC Ability Hand, driven from a haptic controller.',
    ctas: [
      { label: 'View work', href: '#work', style: 'accent' },
      { label: 'Get in touch', href: '#contact', style: 'ghost' },
    ],
  },

  statement:
    'I work between a robot’s sensors and its motors. ~Haptic teleoperation at PSYONIC, LiDAR–camera SLAM for a Mars rover, CAN-bus avionics for a rocket, and reinforcement learning that adapts as its environment changes.~',

  /* ------------------------------------------------------------------ */
  projects: [
    // ── Featured ─────────────────────────────────────────────────────
    {
      id: 'psyonic-teleop',
      tier: 'featured',
      kicker: 'Teleoperation · PSYONIC',
      title: 'Move a handle on your desk. The arm and hand follow.',
      summary:
        'A haptic teleoperation stack that drives a Universal Robots arm with a PSYONIC Ability Hand on its wrist from a Haply Inverse3 — plus the driver and web console that verify the robot is ready before anything moves.',
      stats: [
        { value: '500 Hz', label: 'control loop', accent: true },
        { value: '50 ms', label: 'watchdog' },
      ],
      visual: { art: 'teleop' },
      tags: ['C++17', 'URScript', 'RTDE', 'Haply Inverse3', 'Ability Hand', 'Python', 'WebSocket'],
      case: {
        role: 'Applications Development Intern, Robotic Simulations',
        period: 'Jul 2026 — Present',
        body: [
          {
            type: 'text',
            heading: 'The problem',
            text: [
              'An operator holds a Haply Inverse3, a small haptic arm, and a UR robot arm copies the motion, with an Ability Hand mounted on its tool flange. The commands have to reach the robot every 2 ms, and if the PC or the network stalls, the arm has to stop by itself.',
            ],
          },
          {
            type: 'list',
            heading: 'How it works',
            items: [
              '*Three layers:* a C++ bridge that is the only thing allowed to move the arm or hand, a driver that powers the robot up, checks it and manages the bridge, and a single-page web console on top.',
              '*Headless control:* the PC pushes its own URScript to the controller, so there is no pendant program. The script dials back and takes a velocity command (`speedl`) every 2 ms.',
              '*Clutch-style control:* button A anchors the handle and the robot, so the arm copies how far you move, not where your hand is. Engaging never makes the arm jump.',
              '*Layered safety:* a 50 ms receive timeout on the robot, stale-data checks on the Haply and the robot pose, a ±15 cm workspace box with speeds that taper near the walls, acceleration limits, and a dry-run mode that computes commands without sending them.',
              '*The hand over the robot’s wrist:* the Ability Hand’s RS-485 link runs through the tool flange, is forwarded over TCP, and is turned back into a virtual serial port on the PC with `socat`.',
              '*An operator console:* preflight lists every problem at once (Remote mode, safety state, wired Ethernet, Haply devices, open ports), starts are rolled back if any step fails, and live status reaches the page over a WebSocket.',
            ],
          },
          {
            type: 'text',
            heading: 'Comparing approaches',
            text: [
              'I also documented three ways of getting velocity commands into the arm: a URCap that downloads the script, RTDE input registers read by a pendant script, and the headless C++ bridge. The comparison covers the trade-offs in setup, firewall needs, loop rate, speed clamping and safety layers.',
            ],
          },
        ],
      },
    },
    {
      id: 'visual-odometry',
      tier: 'featured',
      kicker: 'Perception',
      title: 'Turning 3.7 km of driving into 1.94 m of error.',
      summary:
        'Camera-based motion tracking for a car, compared against IMU dead reckoning — including a small sensor flaw I found that would have pushed it off course.',
      stats: [
        { value: '0.05%', label: 'drift', accent: true },
        { value: '3,718 m', label: 'driven' },
      ],
      visual: { art: 'flow' },
      tags: ['Visual odometry', 'Dead reckoning', 'IMU', 'OpenCV', 'Python'],
      case: {
        role: 'Northeastern University',
        period: 'Apr — May 2026',
        body: [
          {
            type: 'text',
            heading: 'What it is',
            text: [
              'An evaluation and comparison of camera-based visual odometry against IMU-based dead reckoning, across scenes rich and poor in visual features.',
            ],
          },
        ],
      },
    },
    {
      id: 'nurover',
      tier: 'featured',
      kicker: 'Field robotics',
      title: 'Real-time mapping for a Mars-analog rover.',
      summary:
        'NURover’s navigation stack fuses LiDAR and camera data into one live map, so the rover can steer around obstacles as they appear.',
      stats: [{ value: '+25%', label: 'localization accuracy', accent: true }],
      visual: { art: 'lidar' },
      tags: ['ROS2', 'Gazebo', 'SLAM', 'LiDAR', 'Sensor fusion'],
      case: {
        role: 'Automation Engineer, Northeastern Mars Rover Team',
        period: 'Sep — Dec 2025',
        body: [
          {
            type: 'list',
            heading: 'What I did',
            items: [
              'Designed and deployed a ROS2-based autonomous navigation stack in Gazebo, integrating LiDAR and camera for real-time SLAM and obstacle avoidance.',
              'Achieved a *25% improvement* in localization accuracy during field tests.',
              'Engineered PCB architecture and power distribution for high-throughput sensors and onboard compute modules.',
            ],
          },
          { type: 'image', src: 'assets/img/current/rover.webp', alt: 'NURover Mars rover' },
        ],
      },
    },
    {
      id: 'meta-rl',
      tier: 'featured',
      kicker: 'Learning',
      title: 'An agent that chooses its own network as conditions change.',
      summary:
        'A REINFORCE meta-controller switches between MLP and LSTM policies every 20 steps, cutting result variance 5× against a PPO baseline.',
      stats: [
        { value: '5×', label: 'less variance', accent: true },
        { value: '4', label: 'changing worlds' },
      ],
      visual: { art: 'variance', wide: { label: 'PPO · σ 146.8', sigma: 146.8 }, narrow: { label: 'meta · σ 26.9', sigma: 26.9 } },
      tags: ['Reinforcement learning', 'REINFORCE', 'LSTM', 'Robosuite', 'MuJoCo'],
      case: {
        role: 'Northeastern University',
        period: 'May 2026',
        body: [
          {
            type: 'text',
            heading: 'What it is',
            text: [
              'A two-level hierarchical RL system. A REINFORCE meta-controller picks the inner policy every 20 steps, switching between an MLP and an LSTM, across four non-stationary environments.',
            ],
          },
          {
            type: 'stats',
            items: [
              { value: 'σ 26.9', label: 'meta-controller', accent: true },
              { value: 'σ 146.8', label: 'PPO baseline' },
            ],
          },
        ],
      },
    },

    // ── More work ────────────────────────────────────────────────────
    {
      id: 'aeronu',
      tier: 'more',
      kicker: 'AerospaceNU',
      title: 'CAN-bus avionics for a student rocket',
      highlight: '40% faster fault alerts',
      summary:
        'A CAN-based avionics system on STM32 microcontrollers, linking GPS, IMU, barometer and telemetry for real-time data relay.',
      tags: ['STM32', 'CAN bus', 'C++', 'Python'],
      case: {
        role: 'Avionics System Engineer',
        period: 'Sep 2025 — Present',
        body: [
          {
            type: 'list',
            heading: 'What I did',
            items: [
              'Built a CAN-based avionics system using STM32 microcontrollers, connecting GPS, IMU, barometer and telemetry for real-time data relay.',
              'Developed flight diagnostics and safety scripts in Python/C++, improving test reliability by *30%*.',
            ],
          },
          { type: 'image', src: 'assets/img/current/pcb.webp', alt: 'AeroNU avionics board' },
        ],
      },
    },
    {
      id: 'ik-solver',
      tier: 'more',
      kicker: 'Kinematics',
      title: 'An inverse-kinematics solver, built from scratch',
      highlight: 'Zero robotics libraries',
      summary:
        'Numerical IK and task-space control of a 7-DOF UR7 manipulator, simulated from scratch in Python.',
      tags: ['Python', 'Kinematics', 'Jacobian', 'Path planning'],
      case: {
        role: 'Northeastern University',
        body: [
          {
            type: 'list',
            heading: 'What I built',
            items: [
              'A 7-DOF manipulator simulator written from scratch in Python, using DH parameters.',
              'The geometric Jacobian for task-space velocity control.',
              'A damped least-squares Newton–Raphson IK solver, which stays stable near singular poses.',
            ],
          },
        ],
      },
    },
    {
      id: 'cpu-slam',
      tier: 'more',
      kicker: 'SLAM',
      title: 'Real-time SLAM on a CPU-only laptop',
      highlight: '15 Hz, under 5 cm off',
    },
    {
      id: 'multi-camera-paper',
      tier: 'more',
      kicker: 'Published · 2025',
      title: 'Multi-camera object measurement',
      highlight: 'Under 2% error',
      summary:
        'A hybrid object detector that fuses multi-view geometry with a custom YOLOv5 model to estimate object size across distributed cameras.',
      tags: ['YOLOv5', 'Multi-view geometry', 'Computer vision'],
      links: [{ label: 'Read the paper', url: 'https://www.jisem-journal.com/index.php/journal/article/view/12745' }],
      case: {
        role: 'JISEM',
        period: 'Feb 2025',
        body: [
          {
            type: 'text',
            heading: 'Paper',
            text: [
              '*Fusion of Deep Learning and Multi-view Geometry for Robust Object Detection in Distributed Camera Systems.* Published in JISEM, 26 Feb 2025.',
              'The system pairs multi-view geometry with a custom YOLOv5 model. It estimates object dimensions with under 2% error and outperforms single-camera methods.',
              'The object detection model also won first prize for Best Startup Potential at Amity University in March 2025.',
            ],
          },
          { type: 'image', src: 'assets/img/projects/ObjectScanner.webp', alt: 'Object measurement demo' },
        ],
      },
    },

    // ── Archive (filterable) ─────────────────────────────────────────
    {
      id: 'orb-slam3',
      tier: 'archive',
      category: 'Robotics',
      title: 'ORB-SLAM3 Realtime',
      summary:
        'Benchmarking ORB-SLAM3 across standard datasets, extended with a real-time monocular mode on a live webcam feed.',
      image: 'assets/img/projects/orb-slam.webp',
      link: 'https://github.com/Awwziz/ORB_SLAM3-Realtime',
    },
    {
      id: 'object-detector',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Object Detector',
      summary: 'Real-time detection with YOLO and OpenCV — bounding boxes and confidence per frame from live video.',
      image: 'assets/img/projects/ObjectDetector.webp',
      link: 'https://github.com/Awwziz/Object-Detector',
    },
    {
      id: 'document-scanner',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Document Scanner',
      summary: 'Finds document edges in real time and applies a 4-point perspective transform for a clean top-down scan.',
      image: 'assets/img/projects/DocumentScanner.webp',
      link: 'https://github.com/Awwziz/Document-Scanner',
    },
    {
      id: 'object-measurement',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Object Measurement',
      summary: 'Estimates real-world object size from one frame using a known reference object.',
      image: 'assets/img/projects/ObjectScanner.webp',
      link: 'https://github.com/Awwziz/Object-Measurement',
    },
    {
      id: 'stm32-can-node',
      tier: 'archive',
      category: 'Hardware',
      title: 'STM32 CAN Bus Node',
      summary: 'Custom STM32 CAN node for AeroNU avionics — GPS, IMU and barometer on a single 4-layer PCB.',
      image: 'assets/img/current/pcb.webp',
    },
    {
      id: 'power-distribution',
      tier: 'archive',
      category: 'Hardware',
      title: 'Power Distribution Board',
      summary: 'Regulated 5 V / 12 V / 19 V rails with per-rail overcurrent protection for the rover’s compute and sensors.',
    },
    {
      id: 'rover-chassis',
      tier: 'archive',
      category: 'Hardware',
      title: 'Rover Chassis Design',
      summary: 'NURover chassis for Mars-analog terrain, with wall thickness tuned through FEA to cut weight.',
      image: 'assets/img/current/rover.webp',
    },
    {
      id: 'telemetry',
      tier: 'archive',
      category: 'Hardware',
      title: 'Telemetry & Ground Station',
      summary: '900 MHz LoRa link streaming altitude, orientation and battery data to a Python dashboard.',
    },
    {
      id: 'ngo-platform',
      tier: 'archive',
      category: 'Web',
      title: 'NGO Platform',
      summary: 'Volunteer sign-up, member auth, API-backed storage and donation tracking — responsive on every screen.',
      link: 'https://github.com/Awwziz/NGO',
    },
    {
      id: 'n-queen',
      tier: 'archive',
      category: 'Web',
      title: 'N-Queen Game',
      summary: 'Interactive constraint puzzle with solver modes that show backtracking and heuristics.',
      image: 'assets/img/projects/NQueenGame.webp',
      link: 'https://github.com/Awwziz/',
    },
  ],

  /* ------------------------------------------------------------------ */
  about: {
    text:
      'MS Robotics at Northeastern, graduating May 2027. At PSYONIC I build teleoperation and simulation tools for a UR arm and the Ability Hand. Before that, I shipped ML, conversational AI and operator interfaces at companies in India and Singapore.',
    portraitCaption: 'Boston, MA',
  },

  // Shown under About. Each row expands to show the bullets.
  experience: [
    {
      org: 'PSYONIC',
      role: 'Applications Development Intern, Robotic Simulations',
      place: 'Boston',
      period: 'Jul 2026 — Now',
      points: [
        'Haptic teleoperation of a UR arm and an Ability Hand from a Haply Inverse3: a 500 Hz C++ control loop with headless URScript control.',
        'A driver and web console for operators: power-up, preflight checks, process management with rollback, and live status over WebSocket.',
        'Documented and compared three ways of streaming velocity commands to a UR arm.',
      ],
    },
    {
      org: 'AerospaceNU',
      role: 'Avionics System Engineer',
      place: 'Boston',
      period: 'Sep 2025 — Now',
      points: [
        'CAN-based avionics on STM32 linking GPS, IMU, barometer and telemetry.',
        'Python/C++ flight diagnostics that raised test reliability by 30%.',
      ],
    },
    {
      org: 'Northeastern Mars Rover Team',
      role: 'Automation Engineer',
      place: 'Boston',
      period: 'Sep — Dec 2025',
      points: [
        'ROS2 navigation stack in Gazebo with LiDAR + camera SLAM and obstacle avoidance.',
        '25% better localization accuracy in field tests.',
        'PCB architecture and power distribution for sensors and onboard compute.',
      ],
    },
    {
      org: 'Alshifa Solution',
      role: 'Automation & Systems Engineer Intern',
      place: 'India',
      period: 'Jan — May 2025',
      points: [
        'Built and deployed a Python ML fault-detection system for robotic subsystems that cut average diagnostic time by ~20%, using real-time sensor log analysis and predictive modelling.',
        'Tied the pipeline into ROS tools and hardware feedback loops for faster on-site troubleshooting.',
      ],
    },
    {
      org: 'Ulavi Technologies',
      role: 'AI/ML Intern',
      place: 'Singapore',
      period: 'May — Jun 2024',
      points: [
        'Led a TensorFlow conversational interface for human-robot interaction, improving intent recognition and cutting latency on embedded systems.',
        'Worked with the embedded and software teams to deploy and tune it in real-time tests.',
      ],
    },
    {
      org: 'Mishka Tech',
      role: 'HMI/UX Intern',
      place: 'India',
      period: 'Jun — Aug 2024',
      points: [
        'Operator interfaces for robotic control systems, with UI logic wired to backend APIs: fewer execution errors and ~30% better command response.',
        'Validated UI-to-hardware API communication with the electrical and software teams.',
      ],
    },
    {
      org: 'ThriveUp',
      role: 'UX Prototyping Intern',
      place: 'India',
      period: 'Sep — Dec 2023',
      points: ['Led UI/UX for a wellness app and helped build it in FlutterFlow, with a focus on accessibility.'],
    },
  ],

  // Publications, awards, talks. `link` is optional.
  recognition: [
    {
      kind: 'Publication',
      title: 'Fusion of Deep Learning and Multi-view Geometry for Robust Object Detection in Distributed Camera Systems',
      org: 'JISEM',
      date: 'Feb 2025',
      link: 'https://www.jisem-journal.com/index.php/journal/article/view/12745',
    },
    {
      kind: 'Award',
      title: 'Best Startup Potential — first prize, for an object detection model',
      org: 'Amity University',
      date: 'Mar 2025',
    },
  ],

  toolkit: {
    'Robotics & simulation': ['ROS / ROS2', 'Gazebo', 'MuJoCo · Robosuite', 'URScript · RTDE', 'SLAM', 'Motion planning'],
    'Perception & ML': ['OpenCV', 'PyTorch', 'TensorFlow', 'YOLOv5 / v8', 'Reinforcement learning', 'Sensor fusion'],
    'Languages & systems': ['Python', 'C++17 · CMake', 'C#', 'Linux', 'Git'],
    'Hardware & CAD': ['STM32 / CAN bus', 'RS-485 · serial', 'Haply Inverse3', 'Arduino · Raspberry Pi', 'SolidWorks · Fusion 360'],
    'Web & backend': ['JavaScript', 'FastAPI', 'WebSocket · REST', 'Node.js · Express', 'MongoDB'],
  },

  // Section headings and small UI text.
  labels: {
    more: 'More work',
    archive: 'Archive',
    recognition: 'Publications & awards',
    toolkit: 'Toolkit',
    caseCta: 'Open case study →',
    notFound: 'That page doesn’t exist.',
  },

  contact: {
    title: 'Now you know\nwhere *to find me.*',
  },
};
