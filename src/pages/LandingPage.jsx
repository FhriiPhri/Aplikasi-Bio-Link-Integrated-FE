import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Music,
  Instagram,
  Gamepad2,
  ShoppingBag,
  Twitter,
  Camera,
  Headphones,
  Zap,
  Palette,
  BarChart3,
  Lock,
  Smartphone,
  Rocket,
  User,
  Link,
  ExternalLink,
  CheckCircle,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Youtube,
  MessageCircle,
} from "lucide-react";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState("light");
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  // Daftar icon yang tersedia
  const availableSocialIcons = [
    { id: "twitter", icon: <Twitter />, name: "Twitter" },
    { id: "instagram", icon: <Camera />, name: "Instagram" },
    { id: "music", icon: <Headphones />, name: "Music" },
    { id: "gaming", icon: <Gamepad2 />, name: "Gaming" },
    { id: "youtube", icon: <Youtube />, name: "YouTube" },
    { id: "tiktok", icon: <MessageCircle />, name: "TikTok" },
  ];

  const [formData, setFormData] = useState({
    username: "yourname",
    bio: "Content Creator",
    links: [
      {
        icon: <Music className="w-5 h-5" />,
        label: "Latest Music Drop",
        color: "from-blue-500 to-cyan-500",
        url: "#",
      },
      {
        icon: <Instagram className="w-5 h-5" />,
        label: "Instagram Feed",
        color: "from-purple-500 to-pink-500",
        url: "#",
      },
      {
        icon: <Gamepad2 className="w-5 h-5" />,
        label: "Gaming Content",
        color: "from-green-500 to-emerald-500",
        url: "#",
      },
      {
        icon: <ShoppingBag className="w-5 h-5" />,
        label: "Shop My Merch",
        color: "from-orange-500 to-red-500",
        url: "#",
      },
    ],
    // Simpan ID icon yang dipilih
    selectedSocials: ["twitter", "instagram", "music"],
  });

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      links: updatedLinks,
    }));
  };

  const handleSocialToggle = (socialId) => {
    setFormData((prev) => {
      const newSelected = prev.selectedSocials.includes(socialId)
        ? prev.selectedSocials.filter((id) => id !== socialId)
        : [...prev.selectedSocials, socialId];

      return {
        ...prev,
        selectedSocials: newSelected,
      };
    });
  };

  const generateLinkPreview = () => {
    return `synapse.link/${formData.username
      .toLowerCase()
      .replace(/\s+/g, "")}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDark = theme === "dark";

  // Professional color system
  const colors = {
    light: {
      bg: "bg-white",
      text: "text-slate-900",
      textSecondary: "text-slate-700",
      textMuted: "text-slate-500",
      border: "border-slate-200",
      borderStrong: "border-slate-300",
      card: "bg-white/80",
      cardHover: "bg-slate-50/80",
      nav: "bg-white/80",
      navBorder: "border-slate-200/80",
      glass: "backdrop-blur-xl bg-white/70",
      glassStrong: "backdrop-blur-xl bg-white/90",
      accentText: "text-blue-700",
      accentBg: "bg-blue-50",
      buttonPrimary: "from-blue-600 to-indigo-600",
      buttonHover: "from-blue-700 to-indigo-700",
      inputBg: "bg-white",
      inputBorder: "border-slate-300",
      inputFocus: "ring-blue-500/50",
      shadow: "shadow-lg shadow-slate-200/60",
      shadowStrong: "shadow-xl shadow-slate-300/50",
    },
    dark: {
      bg: "bg-slate-950",
      text: "text-slate-100",
      textSecondary: "text-slate-300",
      textMuted: "text-slate-400",
      border: "border-slate-700/60",
      borderStrong: "border-slate-600/60",
      card: "bg-slate-800/60",
      cardHover: "bg-slate-700/60",
      nav: "bg-slate-900/80",
      navBorder: "border-slate-700/60",
      glass: "backdrop-blur-xl bg-slate-900/60",
      glassStrong: "backdrop-blur-xl bg-slate-900/80",
      accentText: "text-blue-400",
      accentBg: "bg-blue-950/30",
      buttonPrimary: "from-blue-600 to-indigo-600",
      buttonHover: "from-blue-700 to-indigo-700",
      inputBg: "bg-slate-800/80",
      inputBorder: "border-slate-700",
      inputFocus: "ring-blue-500/50",
      shadow: "shadow-lg shadow-black/20",
      shadowStrong: "shadow-xl shadow-black/30",
    },
  };

  const themeColors = colors[theme];

  const gradients = {
    primary: "from-blue-600 via-indigo-600 to-blue-700",
    secondary: "from-slate-600 to-slate-700",
    accent: "from-blue-500 to-indigo-500",
  };

  const glassEffect = `${themeColors.glass} border ${themeColors.border} ${themeColors.shadow}`;
  const strongGlassEffect = `${themeColors.glassStrong} border ${themeColors.borderStrong} ${themeColors.shadowStrong}`;

  return (
    <div
      className={`min-h-screen ${themeColors.bg} ${themeColors.text} transition-all duration-500 overflow-hidden`}
    >
      {/* Subtle animated background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-[0.03] bg-gradient-to-r from-blue-500 to-indigo-500 animate-float-slow"
          style={{ left: "-10%", top: "10%" }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.02] bg-gradient-to-r from-indigo-500 to-blue-500 animate-float-slower"
          style={{ right: "0%", bottom: "20%" }}
        />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed w-full top-0 z-50 ${themeColors.nav} border-b ${themeColors.navBorder} backdrop-blur-xl transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg">
                  <Link className="text-white w-5 h-5" />
                </div>
              </div>
              <span
                className={`text-2xl font-bold bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}
              >
                Synapse
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Pricing", "Templates"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`relative px-3 py-2 ${themeColors.textSecondary} hover:${themeColors.accentText} transition-colors duration-300 group font-medium`}
                >
                  {item}
                  <span
                    className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r ${gradients.primary} group-hover:w-full transition-all duration-300`}
                  ></span>
                </a>
              ))}
              <button
                onClick={() => navigate("/login")}
                className="group relative px-6 py-2.5 rounded-lg font-medium overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradients.primary}`}
                ></div>
                <span className="relative text-white text-sm">Get Started</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full ${glassEffect} p-1 transition-all duration-300 hover:scale-105`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-gradient-to-r ${
                    gradients.primary
                  } transform transition-transform duration-300 flex items-center justify-center ${
                    isDark ? "translate-x-7" : "translate-x-0"
                  }`}
                >
                  {isDark ? (
                    <Moon className="w-3 h-3 text-white" />
                  ) : (
                    <Sun className="w-3 h-3 text-white" />
                  )}
                </div>
              </button>
              <button
                className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Form */}
            <div className="text-center lg:text-left space-y-8">
              <div
                className={`inline-flex items-center space-x-3 ${glassEffect} px-5 py-3 rounded-full`}
              >
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className={`text-sm font-medium ${themeColors.text}`}>
                  Live Preview Editing
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className={themeColors.text}>Professional Links.</span>
                  <br />
                  <span
                    className={`bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}
                  >
                    Made Simple.
                  </span>
                </h1>

                <p
                  className={`text-lg ${themeColors.textSecondary} max-w-lg mx-auto lg:mx-0 leading-relaxed`}
                >
                  Create a stunning link-in-bio page with real-time preview.
                  Professional, customizable, and ready in minutes.
                </p>
              </div>

              {/* Form */}
              <div className={`space-y-5 p-8 rounded-2xl ${strongGlassEffect}`}>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${themeColors.text}`}
                    >
                      Username
                    </label>
                    <div className="relative">
                      <div
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${themeColors.textMuted} text-sm`}
                      >
                        synapse.link/
                      </div>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className={`w-full pl-32 pr-4 py-3.5 rounded-xl ${themeColors.inputBg} border ${themeColors.inputBorder} focus:outline-none focus:ring-2 ${themeColors.inputFocus} focus:border-blue-500 transition-all duration-300 text-sm font-medium`}
                        placeholder="yourname"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${themeColors.text}`}
                    >
                      Bio
                    </label>
                    <input
                      type="text"
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className={`w-full px-4 py-3.5 rounded-xl ${themeColors.inputBg} border ${themeColors.inputBorder} focus:outline-none focus:ring-2 ${themeColors.inputFocus} focus:border-blue-500 transition-all duration-300 text-sm`}
                      placeholder="Your professional tagline"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-semibold mb-2 ${themeColors.text}`}
                    >
                      Social Links
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {availableSocialIcons.map((social) => {
                        const isSelected = formData.selectedSocials.includes(
                          social.id
                        );
                        return (
                          <button
                            key={social.id}
                            type="button"
                            onClick={() => handleSocialToggle(social.id)}
                            className={`h-12 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
                              isSelected
                                ? `bg-gradient-to-br ${gradients.primary} shadow-lg`
                                : `${themeColors.card} border ${themeColors.border} hover:${themeColors.cardHover}`
                            }`}
                          >
                            {React.cloneElement(social.icon, {
                              className: `w-5 h-5 ${
                                isSelected ? "text-white" : themeColors.text
                              }`,
                            })}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/login")}
                  className="group relative w-full py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${gradients.primary}`}
                  ></div>
                  <span className="relative text-white flex items-center justify-center space-x-2">
                    <span>Create Your Link</span>
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>

                <p className={`text-center text-xs ${themeColors.textMuted}`}>
                  Free forever • No credit card required • 2 minute setup
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  {
                    label: "Users",
                    value: "50K+",
                    icon: <User className="w-4 h-4" />,
                  },
                  {
                    label: "Links",
                    value: "2M+",
                    icon: <Link className="w-4 h-4" />,
                  },
                  {
                    label: "Uptime",
                    value: "99.9%",
                    icon: <CheckCircle className="w-4 h-4" />,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`text-center p-4 rounded-xl ${themeColors.card} border ${themeColors.border} hover:${themeColors.cardHover} transition-all duration-300`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`text-2xl font-bold bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </div>
                      <div className={themeColors.textMuted}>{stat.icon}</div>
                    </div>
                    <div
                      className={`text-xs ${themeColors.textMuted} mt-1 font-medium`}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="relative">
              <div
                className={`absolute -inset-4 bg-gradient-to-r ${gradients.primary} rounded-3xl blur-2xl opacity-5`}
              ></div>

              <div
                className={`relative ${strongGlassEffect} rounded-2xl p-8 transition-all duration-300`}
              >
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${themeColors.card} border ${themeColors.border} text-xs font-semibold shadow-lg`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className={themeColors.text}>Live Preview</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6 mt-2">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${themeColors.text}`}>
                      @{formData.username}
                    </h3>
                    <p className={`text-sm ${themeColors.textMuted}`}>
                      {formData.bio}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {formData.links.map((link, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl ${themeColors.card} border ${themeColors.border} hover:${themeColors.cardHover} hover:border-blue-400 transition-all duration-300 cursor-pointer flex items-center justify-between group`}
                      onMouseEnter={() => setHoveredFeature(idx)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={themeColors.text}>{link.icon}</div>
                        <span
                          className={`font-medium text-sm ${themeColors.text}`}
                        >
                          {link.label}
                        </span>
                      </div>
                      <ExternalLink
                        className={`w-4 h-4 transition-all duration-300 ${
                          hoveredFeature === idx
                            ? "translate-x-0 opacity-100"
                            : "translate-x-2 opacity-0"
                        } ${themeColors.accentText}`}
                      />
                    </div>
                  ))}
                </div>

                <div className={`pt-6 mt-6 border-t ${themeColors.border}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${themeColors.text}`}>
                      Connect
                    </span>
                    <div className="flex space-x-2">
                      {formData.selectedSocials.map((socialId, idx) => {
                        const social = availableSocialIcons.find(
                          (s) => s.id === socialId
                        );
                        if (!social) return null;

                        return (
                          <div
                            key={idx}
                            className={`w-10 h-10 rounded-lg ${glassEffect} flex items-center justify-center text-lg transition-all duration-300 hover:scale-110 cursor-pointer`}
                          >
                            {React.cloneElement(social.icon, {
                              className: `w-5 h-5 ${themeColors.text}`,
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold">
              <span className={themeColors.text}>Powerful Features. </span>
              <span
                className={`bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}
              >
                Simple Interface.
              </span>
            </h2>
            <p
              className={`text-lg ${themeColors.textSecondary} max-w-2xl mx-auto`}
            >
              Everything you need to create a professional online presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Instant Updates",
                desc: "See your changes in real-time with live preview",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Custom Design",
                desc: "Personalize colors, fonts, and layouts easily",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analytics",
                desc: "Track clicks and visitor engagement metrics",
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "Secure",
                desc: "Enterprise-grade security for your data",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Responsive",
                desc: "Perfect on desktop, tablet, and mobile",
              },
              {
                icon: <Rocket className="w-6 h-6" />,
                title: "Fast Deploy",
                desc: "Go live instantly with one-click publishing",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className={`group p-8 rounded-2xl ${themeColors.card} border ${themeColors.border} hover:${themeColors.cardHover} hover:border-blue-400 transition-all duration-300 cursor-pointer`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradients.primary} flex items-center justify-center text-2xl transform group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className={`text-xl font-bold ${themeColors.text}`}>
                    {feature.title}
                  </h3>
                  <p className={`${themeColors.textSecondary} leading-relaxed`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t ${themeColors.border} py-16 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients.primary} flex items-center justify-center shadow-lg`}
                >
                  <Link className="text-white w-5 h-5" />
                </div>
                <span
                  className={`text-xl font-bold bg-gradient-to-r ${gradients.primary} bg-clip-text text-transparent`}
                >
                  Synapse
                </span>
              </div>
              <p className={`text-sm ${themeColors.textSecondary}`}>
                Professional link pages made simple. Join thousands of creators.
              </p>
            </div>

            {["Product", "Resources", "Company"].map((category) => (
              <div key={category}>
                <h4 className={`font-semibold mb-4 ${themeColors.text}`}>
                  {category}
                </h4>
                <ul className="space-y-2">
                  {["Features", "Pricing", "Templates", "Support"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className={`text-sm ${themeColors.textSecondary} hover:${themeColors.accentText} transition-colors duration-300`}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div
            className={`pt-8 border-t ${themeColors.border} flex flex-col md:flex-row justify-between items-center gap-4`}
          >
            <p className={`text-sm ${themeColors.textMuted}`}>
              © 2026 Synapse. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className={`text-sm ${themeColors.textSecondary} hover:${themeColors.accentText} transition-colors duration-300`}
              >
                Privacy
              </a>
              <a
                href="#"
                className={`text-sm ${themeColors.textSecondary} hover:${themeColors.accentText} transition-colors duration-300`}
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-20px, -20px);
          }
        }

        @keyframes float-slower {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }

        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }

        .animate-float-slower {
          animation: float-slower 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;