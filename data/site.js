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
           'hidden'   → kept here but not shown anywhere
     Give a project a `case` object and it gets its own page at
     project.html?id=<id>. Otherwise the card links to `link` (if any).

   Visuals (cards + case pages):
     { art: 'flow' | 'lidar' | 'variance' | 'teleop' }            big drawings
     { art: 'detect' | 'scan' | 'measure' | 'queens' | 'board' |
            'radio' | 'web' | 'chat' }                            small drawings
     { image: 'assets/img/...', alt: '...' }                      your own picture
     Archive cards can also use `image:` directly. Anything with neither
     gets a dotted LiDAR-style placeholder.
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
      'I write the software that makes robots dependable: they know where they are, follow a human’s hand at 500 Hz, and stop safely the moment something goes wrong. Currently building haptic teleoperation at PSYONIC.',
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
          { type: 'image', src: 'assets/img/current/rover.webp', alt: 'The NURover Mars-analog rover in the lab' },
        ],
      },
    },
    {
      id: 'meta-rl',
      tier: 'featured',
      kicker: 'Learning',
      title: 'An agent that chooses its own network as conditions change.',
      summary:
        'A REINFORCE meta-controller switches between MLP and LSTM policies as the world shifts under it, with 5× less run-to-run variance than a single high-capacity agent on LunarLander.',
      stats: [
        { value: '5×', label: 'less variance', accent: true },
        { value: '4', label: 'changing worlds' },
      ],
      visual: { art: 'variance', wide: { label: 'high-capacity · σ 146.8', sigma: 146.8 }, narrow: { label: 'self-modifying · σ 26.9', sigma: 26.9 } },
      tags: ['Hierarchical RL', 'REINFORCE', 'PPO', 'LSTM', 'Behavioural cloning', 'Robosuite', 'MuJoCo', 'Gymnasium', 'PyTorch'],
      links: [
        { label: 'View code', url: 'https://github.com/azizxabd/self-modifying-rl' },
        { label: '1D environment', url: 'https://github.com/azizxabd/self-modifying-1D' },
        { label: 'Demo video', url: 'https://github.com/azizxabd/self-modifying-rl/blob/main/results/videos/scripted_policy.mp4' },
      ],
      case: {
        role: 'Northeastern University · CS 4180/5180',
        period: 'Apr — May 2026',
        body: [
          {
            type: 'text',
            heading: 'The idea',
            text: [
              'Different conditions reward different network architectures: memory helps when the task has hidden state, and a simple feed-forward policy reacts faster when it doesn’t. When the environment changes mid-episode, no single choice is right for long. So instead of choosing up front, I let the agent choose.',
              'A two-level hierarchical RL system. Every 20 steps, a REINFORCE meta-controller decides whether to keep or switch between a memoryless MLP and a memory-aware LSTM inner policy, each with its own PPO actor-critic head.',
            ],
          },
          {
            type: 'list',
            heading: 'How it’s built',
            items: [
              '*Meta-controller:* a small network (7 → 64 → 64 → 2) that reads a 7-dimensional meta-state (mean and spread of recent reward, reward trend, lift rate, episode time, current architecture) and is trained with REINFORCE plus a *switching-cost penalty* (λ = 0.3) so it doesn’t flip for no reason.',
              '*Inner policies:* a 3-layer MLP (256-256-128 with LayerNorm) and an LSTM (256 → LSTM 128 → 128), both trained with PPO.',
              '*Four non-stationary environments,* each moving through three phases: a custom 1D task (sprint → conserve → stabilise), CartPole (normal → 3× pole mass → wind), LunarLander (normal → stronger gravity → wind and turbulence), and a Robosuite Panda lift (0.1 kg → 0.3 kg cube → random forces).',
              '*Robosuite pipeline:* a scripted lift policy (100% success) generates demonstrations in parallel, behavioural cloning pre-trains the policies, then PPO fine-tunes them.',
              'Four baselines: fixed PPO, a single high-capacity agent, heuristic switching and random switching.',
            ],
          },
          {
            type: 'stats',
            items: [
              { value: '+2.87', label: 'reward on the 1D task, where fixed PPO collapsed to −15.56', accent: true },
              { value: '±27', label: 'on LunarLander, vs ±147 for the high-capacity agent' },
              { value: '1.5–5.4', label: 'switches per episode, vs 5–37 for random switching' },
            ],
          },
          {
            type: 'table',
            heading: 'Results (mean episode return)',
            columns: ['Environment', 'Self-modifying', 'High-capacity', 'Fixed PPO', 'Heuristic', 'Random'],
            rows: [
              ['1D non-stationary', '*+2.87 ± 5.01*', '—', '−15.56', '+2.99', '−0.43'],
              ['CartPole', '+297 ± 48', '+474 ± 9', '+312 ± 12', '+340 ± 19', '+219 ± 19'],
              ['LunarLander', '+347 ± *27*', '+432 ± 147', '+359 ± 136', '+309 ± 73', '+226 ± 14'],
              ['Robosuite lift', '+420 ± 6', '+477 ± 4', '+538 ± 0.4', '−5.5 ± 0.4', '−298 ± 6'],
            ],
            note: 'Being honest about the trade-off: on simpler tasks like CartPole, one big network still wins on raw return. The hierarchy pays off in stability and on the tasks where conditions shift the most.',
          },
          {
            type: 'table',
            heading: 'What the agent learned to prefer',
            columns: ['Environment', 'MLP', 'LSTM', 'Why it makes sense'],
            rows: [
              ['1D non-stationary', '69%', '31%', 'Reactive task, memory adds little'],
              ['CartPole', '41%', '59%', 'Balanced, still learning'],
              ['LunarLander', '*85%*', '15%', 'Fast reactions matter most'],
              ['Robosuite lift', '19%', '*81%*', 'Memory needed to track the phase'],
            ],
            note: 'Nobody told it which architecture suits which task. These preferences emerged from reward alone.',
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
      visual: { art: 'board' },
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
        ],
      },
    },
    {
      id: 'ik-solver',
      tier: 'more',
      kicker: 'Kinematics',
      title: 'An inverse-kinematics solver, built from scratch',
      visual: { art: 'arm' },
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
      visual: { art: 'slam' },
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
      visual: { art: 'rcm' },
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
      visual: { art: 'measure' },
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
            ],
          },
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
      visual: { art: 'detect' },
      summary: 'Real-time webcam detection with an SSD MobileNet v3 (COCO) model through OpenCV’s DNN module, with frame-to-frame box smoothing to cut jitter.',
      link: 'https://github.com/Awwziz/Object-Detector',
    },
    {
      id: 'document-scanner',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Document Scanner',
      visual: { art: 'scan' },
      summary: 'Finds document edges in real time and applies a 4-point perspective transform for a clean top-down scan.',
      link: 'https://github.com/Awwziz/Document-Scanner',
    },
    {
      id: 'object-measurement',
      tier: 'archive',
      category: 'AI / ML',
      title: 'Object Measurement',
      visual: { art: 'measure' },
      summary: 'Measures objects in centimetres using an A4 sheet as the reference: finds the page, warps it to a metric top-down plane, then sizes every rectangle on it.',
      link: 'https://github.com/Awwziz/Object-Measurement',
    },
    {
      id: 'stm32-can-node',
      tier: 'hidden', // duplicate of another entry
      category: 'Hardware',
      title: 'STM32 CAN Bus Node',
      visual: { art: 'board' },
      summary: 'Custom STM32 CAN node for AeroNU avionics — GPS, IMU and barometer on a single 4-layer PCB.',
    },
    {
      id: 'power-distribution',
      tier: 'hidden', // duplicate of another entry
      category: 'Hardware',
      title: 'Power Distribution Board',
      visual: { art: 'board' },
      summary: 'Regulated 5 V / 12 V / 19 V rails with per-rail overcurrent protection for the rover’s compute and sensors.',
    },
    {
      id: 'rover-chassis',
      tier: 'hidden', // duplicate of another entry
      category: 'Hardware',
      title: 'Rover Chassis Design',
      summary: 'NURover chassis for Mars-analog terrain, with wall thickness tuned through FEA to cut weight.',
      image: 'assets/img/current/rover.webp',
    },
    {
      id: 'telemetry',
      tier: 'hidden', // duplicate of another entry
      category: 'Hardware',
      title: 'Telemetry & Ground Station',
      visual: { art: 'radio' },
      summary: '900 MHz LoRa link streaming altitude, orientation and battery data to a Python dashboard.',
    },
    {
      id: 'portfolio-site',
      tier: 'archive',
      category: 'Web',
      title: 'This portfolio',
      summary:
        'A static site rendered from a single data file: no framework, no build step. Generated line art, light and dark themes, case-study pages, and about 105 KB to first paint.',
      image: 'assets/img/misc/social-card.png',
      tags: ['JavaScript', 'HTML / CSS', 'SVG', 'GitHub Pages', 'Python (image tooling)'],
      links: [{ label: 'View source', url: 'https://github.com/azizxabd/azizxabd.github.io' }],
      case: {
        role: 'Personal project',
        period: '2026',
        body: [
          {
            type: 'list',
            heading: 'How it’s built',
            items: [
              '*One data file.* Every project, job, label and colour lives in `data/site.js`; a small renderer turns it into the home page and these case-study pages. Adding a project means adding one object.',
              '*Generated art.* The terrain, optical-flow, LiDAR, teleop and variance drawings are drawn in code from each project’s real numbers, so they cost almost nothing to load.',
              '*Fast by default.* Images are converted to WebP and resized by a script, load lazily, and fonts never block the first paint: about 105 KB before the page shows, down from 11 MB.',
              '*Themes and access.* Light and dark themes follow the visitor’s system, with keyboard focus states, reduced-motion support and a layout that holds from phone to desktop.',
            ],
          },
        ],
      },
    },
    {
      id: 'therapy-assistant',
      tier: 'archive',
      category: 'Web',
      title: 'Mental Health AI Assistant',
      visual: { art: 'chat' },
      summary:
        'A full-stack support app: chat with an AI assistant, track mood, keep a journal, with secure sign-in. Next.js + TypeScript front end, Flask + MongoDB back end, OpenAI API.',
      link: 'https://github.com/Awwziz/therapy-assisstant',
    },
    {
      id: 'ngo-platform',
      tier: 'archive',
      category: 'Web',
      title: 'NGO Platform',
      visual: { art: 'web' },
      summary: 'Donations, volunteer sign-ups, NGO profiles and campaigns, on a Node.js, Express and MongoDB backend.',
      link: 'https://github.com/Awwziz/NGO',
    },
    {
      id: 'n-queen',
      tier: 'archive',
      category: 'Web',
      title: 'N-Queen Game',
      visual: { art: 'queens' },
      summary: 'Interactive constraint puzzle with solver modes that show backtracking and heuristics.',
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
    recognition: 'Awards',
    toolkit: 'Toolkit',
    caseCta: 'Open case study →',
    notFound: 'That page doesn’t exist.',
  },

  contact: {
    title: 'Now you know\nwhere *to find me.*',
  },
};
