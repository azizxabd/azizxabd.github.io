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
  sections: ['hero', 'statement', 'featured', 'more', 'archive', 'about', 'education', 'recognition', 'toolkit', 'contact'],

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
        'A stereo visual odometry pipeline benchmarked against IMU dead reckoning on KITTI and RosarioV2 — including a gyroscope bias I found that would have added 8+ radians of phantom drift.',
      stats: [
        { value: '0.05%', label: 'drift on KITTI', accent: true },
        { value: '3,718 m', label: 'driven' },
      ],
      visual: { art: 'flow' },
      tags: ['Stereo VO', 'ORB / SIFT', 'PnP + RANSAC', 'IMU dead reckoning', 'ATE / RPE', 'OpenCV', 'Python'],
      case: {
        role: 'Northeastern University',
        period: 'Apr — May 2026',
        body: [
          {
            type: 'text',
            heading: 'The question',
            text: [
              'How far can a vehicle trust its own estimate of where it is? I compared camera-based visual odometry with IMU dead reckoning in scenes rich and poor in visual features, on the KITTI driving dataset and the RosarioV2 agricultural field dataset.',
            ],
          },
          {
            type: 'list',
            heading: 'What I built',
            items: [
              'A full stereo VO pipeline: ORB and SIFT features, stereo triangulation, and PnP + RANSAC pose estimation.',
              'IMU dead reckoning, benchmarked against ground truth with absolute and relative trajectory error (ATE / RPE).',
              'Found a *0.0105 rad/s gyroscope bias* in the field data. Correcting it prevented *8+ radians* of phantom heading drift across an 800-second run.',
            ],
          },
          {
            type: 'stats',
            items: [
              { value: '1.94 m', label: 'ATE over 3,718 m · KITTI (0.05%)', accent: true },
              { value: '25.26 m', label: 'ATE over 165 m · Rosario (15.3%)' },
            ],
          },
          {
            type: 'text',
            heading: 'What it shows',
            text: [
              'On smooth roads, dead reckoning stays remarkably tight. On rough, feature-poor field terrain, drift is roughly 300× worse, which is exactly where catching a small sensor bias pays off.',
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
        'NURover’s ROS2 navigation stack fuses LiDAR and stereo camera data for real-time SLAM and dynamic obstacle avoidance on unstructured terrain.',
      stats: [{ value: '+25%', label: 'localization accuracy', accent: true }],
      visual: { art: 'lidar' },
      tags: ['ROS2', 'Gazebo', 'SLAM', 'LiDAR', 'Stereo', 'Sensor fusion'],
      case: {
        role: 'Automation Engineer, Northeastern Mars Rover Team',
        period: 'Sep — Dec 2025',
        body: [
          {
            type: 'list',
            heading: 'What I did',
            items: [
              'Engineered a ROS2 navigation stack fusing LiDAR and stereo camera data for real-time SLAM and dynamic obstacle avoidance on unstructured Mars-analog terrain.',
              'Improved localization accuracy by *25% over baseline* during competitive field trials.',
              'Validated behaviour before deployment in Gazebo simulation environments.',
              'Engineered PCB architecture and power distribution for high-throughput sensors and onboard compute.',
            ],
          },
          { type: 'image', src: 'assets/img/current/rover-crop.webp', alt: 'The NURover Mars-analog rover in the lab' },
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
      tags: ['Hierarchical RL', 'REINFORCE', 'PPO', 'LSTM', 'Robosuite', 'MuJoCo', 'PyTorch'],
      case: {
        role: 'Northeastern University',
        period: 'May 2026',
        body: [
          {
            type: 'text',
            heading: 'The idea',
            text: [
              'Different environments reward different network architectures: memory helps when the world hides its state, and a simple feed-forward policy wins when it doesn’t. So instead of choosing up front, I let the agent choose.',
              'A two-level hierarchical RL system: a REINFORCE meta-controller selects between an MLP and an LSTM inner policy every 20 steps, across four non-stationary environments.',
            ],
          },
          {
            type: 'stats',
            items: [
              { value: '+2.87', label: 'reward on the 1D task (fixed PPO: −15.56)', accent: true },
              { value: 'σ 26.9', label: 'on LunarLander (PPO: σ 146.8)' },
            ],
          },
          {
            type: 'text',
            heading: 'What emerged',
            text: [
              'With no prior, the meta-controller developed clear preferences: *81.4% LSTM* on Robosuite and *84.7% MLP* on LunarLander, matching the structure of each task.',
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
      highlight: '40% faster fault response',
      summary:
        'A CAN-bus avionics system on STM32 microcontrollers integrating GPS, IMU and telemetry across distributed hardware that had no communication backbone.',
      stats: [
        { value: '30%', label: 'more reliable tests', accent: true },
        { value: '40%', label: 'faster fault response' },
      ],
      tags: ['STM32', 'CAN bus', 'Embedded C/C++', 'Python', 'Telemetry'],
      case: {
        role: 'Avionics System Engineer',
        period: 'Sep 2025 — Present',
        body: [
          {
            type: 'list',
            heading: 'What I did',
            items: [
              'Architected a CAN-bus avionics system on STM32 microcontrollers, integrating GPS, IMU, barometer and telemetry across distributed hardware with no prior communication backbone.',
              'Cut fault-response time by *40%* with automated threshold-based alerting.',
              'Built structured post-flight telemetry logging and Python/C++ diagnostics, improving test reliability by *30%*.',
            ],
          },
          { type: 'art', art: 'board' },
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
        'Numerical IK and task-space control of a 7-DOF UR7 manipulator, written from scratch in Python.',
      tags: ['Python', 'DH parameters', 'Geometric Jacobian', 'Damped least squares', 'SE(3) control', 'Trajectory planning'],
      case: {
        role: 'Northeastern University',
        period: 'Dec 2025',
        body: [
          {
            type: 'list',
            heading: 'What I built',
            items: [
              'Derived DH parameters from UR-series specifications and computed the geometric Jacobian analytically.',
              'Implemented a damped least-squares Newton–Raphson IK solver that stays stable near singular poses.',
              'Autonomous helical trajectory tracking and real-time keyboard-driven Cartesian control.',
              '*Stable convergence across all tested configurations*, with zero external robotics library dependencies.',
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
      summary:
        'An OpenCV-based SLAM stack tuned to run in real time on a GPU-free Linux machine.',
      stats: [
        { value: '15 Hz', label: 'mapping rate', accent: true },
        { value: '<5 cm', label: 'error over 20 m' },
      ],
      tags: ['SLAM', 'OpenCV', 'Linux', 'Optimisation'],
      case: {
        role: 'Northeastern University',
        period: 'Dec 2025',
        body: [
          {
            type: 'text',
            heading: 'What I did',
            text: [
              'Optimised an OpenCV-based SLAM stack on a GPU-free Linux platform, reaching *15 Hz* mapping with *under 5 cm* localization error over 20 m, without any hardware acceleration.',
            ],
          },
        ],
      },
    },
    {
      id: 'rcm-lens',
      tier: 'more',
      kicker: 'Mechanism design',
      title: 'A 4-DOF remote-centre-of-motion mechanism for spacecraft optics',
      highlight: 'Exact pivot point, full range',
      summary:
        'A 4-DOF RCM mechanism in SolidWorks for spacecraft lens alignment, holding an exact pivot point throughout its actuation range.',
      tags: ['SolidWorks', 'Mechanism design', 'Kinematics'],
      case: {
        role: 'Northeastern University',
        period: 'Dec 2025',
        body: [
          {
            type: 'text',
            heading: 'What I did',
            text: [
              'Designed a 4-DOF remote-centre-of-motion mechanism in SolidWorks for spacecraft lens alignment. It enforces exact pivot-point constraints throughout the full actuation range, eliminating off-axis displacement in space-constrained optical assemblies.',
            ],
          },
        ],
      },
    },
    {
      id: 'multi-camera-paper',
      tier: 'more',
      kicker: 'Published · 2025',
      title: 'Multi-camera object measurement',
      highlight: 'Under 2% error',
      summary:
        'A hybrid object detector that fuses multi-view geometry with a custom YOLOv5 model to estimate object size across distributed cameras.',
      tags: ['YOLOv5', 'Multi-view geometry', 'Computer vision', 'PyTorch'],
      links: [{ label: 'Read the paper', url: 'https://www.jisem-journal.com/index.php/journal/article/view/12745' }],
      case: {
        role: 'JISEM',
        period: 'Feb 2025',
        body: [
          {
            type: 'text',
            heading: 'Paper',
            text: [
              '*Fusion of Deep Learning and Multi-view Geometry for Robust Object Detection in Distributed Camera Systems.* Abdul Aziz et al., JISEM, 26 Feb 2025.',
              'A hybrid pipeline that combines a custom YOLOv5 model with multi-view geometric constraints across a distributed camera network. It estimates object dimensions with *under 2% error*, outperforms single-camera baselines in every tested configuration, and keeps its accuracy under viewpoint changes that appearance-only models cannot handle.',
              'The object detection model also won first prize for Best Startup Potential at Amity University in March 2025.',
            ],
          },
          { type: 'art', art: 'measure' },
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
      image: 'assets/img/projects/orb-slam-crop.webp',
      link: 'https://github.com/Awwziz/ORB_SLAM3-Realtime',
    },
    {
      id: 'object-detector',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Object Detector',
      summary: 'Real-time detection with YOLO and OpenCV — bounding boxes and confidence per frame from live video.',
      visual: { art: 'detect' },
      link: 'https://github.com/Awwziz/Object-Detector',
    },
    {
      id: 'document-scanner',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Document Scanner',
      summary: 'Finds document edges in real time and applies a 4-point perspective transform for a clean top-down scan.',
      visual: { art: 'scan' },
      link: 'https://github.com/Awwziz/Document-Scanner',
    },
    {
      id: 'object-measurement',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Object Measurement',
      summary: 'Estimates real-world object size from one frame using a known reference object.',
      visual: { art: 'measure' },
      link: 'https://github.com/Awwziz/Object-Measurement',
    },
    {
      id: 'stm32-can-node',
      tier: 'archive',
      category: 'Hardware',
      title: 'STM32 CAN Bus Node',
      summary: 'Custom STM32 CAN node for AeroNU avionics — GPS, IMU and barometer on a single 4-layer PCB.',
      visual: { art: 'board' },
    },
    {
      id: 'power-distribution',
      tier: 'archive',
      category: 'Hardware',
      title: 'Power Distribution Board',
      summary: 'Regulated 5 V / 12 V / 19 V rails with per-rail overcurrent protection for the rover’s compute and sensors.',
      visual: { art: 'board' },
    },
    {
      id: 'rover-chassis',
      tier: 'archive',
      category: 'Hardware',
      title: 'Rover Chassis Design',
      summary: 'NURover chassis for Mars-analog terrain, with wall thickness tuned through FEA to cut weight.',
      image: 'assets/img/current/rover-crop.webp',
    },
    {
      id: 'telemetry',
      tier: 'archive',
      category: 'Hardware',
      title: 'Telemetry & Ground Station',
      summary: '900 MHz LoRa link streaming altitude, orientation and battery data to a Python dashboard.',
      visual: { art: 'radio' },
    },
    {
      id: 'ngo-platform',
      tier: 'archive',
      category: 'Web',
      title: 'NGO Platform',
      summary: 'Volunteer sign-up, member auth, API-backed storage and donation tracking — responsive on every screen.',
      visual: { art: 'web' },
      link: 'https://github.com/Awwziz/NGO',
    },
    {
      id: 'n-queen',
      tier: 'archive',
      category: 'Web',
      title: 'N-Queen Game',
      summary: 'Interactive constraint puzzle with solver modes that show backtracking and heuristics.',
      visual: { art: 'queens' },
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
        'Architected CAN-bus avionics on STM32 integrating GPS, IMU and telemetry across hardware with no prior communication backbone.',
        'Automated threshold-based alerting cut fault-response time by 40%; post-flight telemetry logging improved test reliability by 30%.',
      ],
    },
    {
      org: 'Northeastern Mars Rover Team',
      role: 'Automation Engineer',
      place: 'Boston',
      period: 'Sep — Dec 2025',
      points: [
        'ROS2 navigation stack fusing LiDAR and stereo for real-time SLAM and dynamic obstacle avoidance on Mars-analog terrain.',
        '25% better localization accuracy over baseline in competitive field trials, validated first in Gazebo.',
        'PCB architecture and power distribution for sensors and onboard compute.',
      ],
    },
    {
      org: 'Alshifa Solution',
      role: 'Automation & Systems Engineer Intern',
      place: 'India',
      period: 'Jan — May 2025',
      points: [
        'Architected an ML fault-detection pipeline trained on historical hardware and software failures, replacing manual triage with predictive maintenance and cutting average diagnostic time by ~20%.',
        'Owned end-to-end ML deployment, from preprocessing and feature engineering to production validation, and set the repeatable deployment standard the engineering team adopted.',
      ],
    },
    {
      org: 'Ulavi Technologies',
      role: 'AI/ML Intern',
      place: 'Singapore',
      period: 'May — Jun 2024',
      points: [
        'Built and deployed an NLP conversational agent with intent classification and multi-turn dialogue management, resolving complex queries without human escalation.',
        'Diagnosed drop-off in multi-step conversations and restructured the dialogue flow through usability testing and fine-tuning, improving end-to-end task completion.',
      ],
    },
    {
      org: 'Mishka Tech',
      role: 'HMI & UX Intern',
      place: 'India',
      period: 'Jun — Aug 2024',
      points: [
        'Redesigned HMI layouts for web and mobile control platforms across three iterations, reducing operator steps per control sequence and improving command response by ~30%.',
        'Delivered prototypes from wireframe to production-ready Figma handoff, creating the documentation standard used for all later releases.',
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

  education: [
    {
      school: 'Northeastern University',
      degree: 'MS, Robotics',
      place: 'Boston, MA',
      period: 'Expected May 2027',
      detail: 'Mobile Robotics · Robot Mechanics & Control · Robot Sensing & Navigation · Reinforcement Learning · Advanced Field Robotics · Mechatronics Systems',
    },
    {
      school: 'Amity University Uttar Pradesh',
      degree: 'BTech, Computer Science Engineering',
      place: 'India',
      period: 'June 2025',
      detail: 'Algorithms · Artificial Intelligence · Data Structures · Control Systems · Computer Architecture · Compiler Construction',
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
    'Robotics systems': ['ROS2', 'Autonomous navigation', 'SLAM', 'LiDAR / camera fusion', 'URScript · RTDE', 'Haptic teleoperation'],
    'Perception & estimation': ['OpenCV', 'Stereo visual odometry', 'ORB / SIFT', 'PnP + RANSAC', 'IMU dead reckoning', 'ATE / RPE benchmarking'],
    'Kinematics & control': ['DH parameters', 'Geometric Jacobian', 'Damped least-squares IK', 'SE(3) task-space control', 'Trajectory planning'],
    'AI & machine learning': ['PyTorch', 'TensorFlow', 'PPO · REINFORCE · hierarchical RL', 'Behavioural cloning', 'YOLOv5 / v8', 'Multi-view geometry'],
    'Embedded & hardware': ['STM32 · Arduino', 'CAN bus · RS-485', 'PCB design & fabrication', 'Brushless motor control', 'Power distribution'],
    'Languages & tools': ['Python', 'C++17 · CMake', 'C#', 'Linux · Git', 'Gazebo · MuJoCo · Robosuite', 'SolidWorks · Fusion 360 · Figma'],
  },

  // Section headings and small UI text.
  labels: {
    more: 'More work',
    archive: 'Archive',
    education: 'Education',
    recognition: 'Publications & awards',
    toolkit: 'Toolkit',
    caseCta: 'Open case study →',
    notFound: 'That page doesn’t exist.',
  },

  contact: {
    title: 'Now you know\nwhere *to find me.*',
  },
};
