// /* eslint-disable react/no-unescaped-entities */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   Menu,
//   X,
//   Home,
//   User,
//   Briefcase,
//   Mail,
//   ChevronDown,
//   Bell,
//   Search,
//   XCircle,
//   LayoutDashboard,
//   LogOut,
//   LogIn,
// } from "lucide-react";
// import Image from "next/image";
// import Logo from "../../../app/assets/logo.png";
// import { usePathname, useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { RootState } from "@/src/redux/store";
// import Link from "next/link";
// import { useLogOutMutation } from "@/src/redux/features/auth/authApi";
// import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation } from "@/src/redux/features/notification/notificationApi";

// const Navbar = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
//   const [bottomDropdownOpen, setBottomDropdownOpen] = useState<string | null>(
//     null,
//   );
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeItem, setActiveItem] = useState("Home");
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const [notificationOpen, setNotificationOpen] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const bottomDropdownRef = useRef<HTMLDivElement>(null);
//   const profileDropdownRef = useRef<HTMLDivElement>(null);
//   const notificationRef = useRef<HTMLDivElement>(null);

//   const [logout] = useLogOutMutation();

//   const { isAuthenticated, user } = useSelector(
//     (state: RootState) => state.auth,
//   );

//   // Notification API calls
//   const { data: notificationResponse, refetch: refetchNotifications, isLoading: notificationsLoading } = useGetUserNotificationsQuery(user?.id || "", {
//     skip: !user?.id,
//     pollingInterval: 60000, // প্রতি ১ মিনিটে আপডেট
//   });

//   const [markAsRead] = useMarkNotificationAsReadMutation();

//   // Extract notifications from response
//   const notifications = (() => {
//     if (!notificationResponse) return [];
    
//     if (Array.isArray(notificationResponse)) {
//       return notificationResponse;
//     }
    
//     if (notificationResponse.data && Array.isArray(notificationResponse.data)) {
//       return notificationResponse.data;
//     }
    
//     if (notificationResponse.data?.notifications && Array.isArray(notificationResponse.data.notifications)) {
//       return notificationResponse.data.notifications;
//     }
    
//     for (const key in notificationResponse) {
//       if (Array.isArray(notificationResponse[key])) {
//         return notificationResponse[key];
//       }
//     }
    
//     return [];
//   })();

//   const unreadNotifications = notifications.filter((n: any) => !n.isRead);
//   const unreadCount = unreadNotifications.length;

//   const navItems = [
//     {
//       name: "Home",
//       icon: <Home className="w-4 h-4" />,
//       href: "/",
//       exact: true,
//     },
//     { name: "About", icon: <User className="w-4 h-4" />, href: "/about" },
//     {
//       name: "Services",
//       icon: <Briefcase className="w-4 h-4" />,
//       href: "/services",
//       dropdown: [
//         { name: "Web Development", href: "/services/web-development" },
//         { name: "Mobile Apps", href: "/services/mobile-apps" },
//         { name: "UI/UX Design", href: "/services/ui-ux" },
//         { name: "Consulting", href: "/services/consulting" },
//       ],
//     },
//     { name: "Contact", icon: <Mail className="w-4 h-4" />, href: "/contact" },
//   ];

//   // Set active item based on current path
//   useEffect(() => {
//     const currentItem = navItems.find((item) => {
//       if (item.exact) {
//         return pathname === item.href;
//       }
//       return pathname.startsWith(item.href);
//     });
//     if (currentItem) {
//       setActiveItem(currentItem.name);
//     }
//   }, [pathname]);

//   // Handle click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       // For mobile search
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         if (window.innerWidth < 768) {
//           setSearchOpen(false);
//         }
//       }

//       // For bottom navigation dropdown
//       if (
//         bottomDropdownRef.current &&
//         !bottomDropdownRef.current.contains(event.target as Node)
//       ) {
//         setBottomDropdownOpen(null);
//       }

//       // For profile dropdown
//       if (
//         profileDropdownRef.current &&
//         !profileDropdownRef.current.contains(event.target as Node)
//       ) {
//         setProfileDropdownOpen(false);
//       }

//       // For notification dropdown
//       if (
//         notificationRef.current &&
//         !notificationRef.current.contains(event.target as Node)
//       ) {
//         setNotificationOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       console.log("Searching for:", searchQuery);
//       setSearchOpen(false);
//     }
//   };

//   const handleItemClick = (itemName: string) => {
//     setActiveItem(itemName);
//     setIsOpen(false);
//     setDropdownOpen(null);
//     setBottomDropdownOpen(null);
//     setNotificationOpen(false);
//   };

//   const toggleDropdown = (itemName: string, type: "navbar" | "bottom") => {
//     if (type === "navbar") {
//       setDropdownOpen(dropdownOpen === itemName ? null : itemName);
//       setBottomDropdownOpen(null);
//       setNotificationOpen(false);
//     } else {
//       setBottomDropdownOpen(bottomDropdownOpen === itemName ? null : itemName);
//       setDropdownOpen(null);
//       setNotificationOpen(false);
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   // Dynamic active class based on item name
//   const isActive = (itemName: string) => activeItem === itemName;

//   // Handle logout function
//   const handleLogout = async () => {
//     try {
//       await logout({}).unwrap();
//       // Clear dropdowns and close mobile menu
//       setProfileDropdownOpen(false);
//       setBottomDropdownOpen(null);
//       setNotificationOpen(false);
//       setIsOpen(false);
//       // Redirect to home page
//       router.push("/");
//       router.refresh(); // Refresh the page to update auth state
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   // Handle navigation for mobile
//   const handleMobileNavigation = (href: string, itemName: string) => {
//     handleItemClick(itemName);
//     router.push(href);
//   };

//   // Handle main item click in bottom navigation
//   const handleBottomItemClick = (item: any) => {
//     if (item.dropdown) {
//       // If item has dropdown, toggle the dropdown
//       toggleDropdown(item.name, "bottom");
//     } else {
//       // If item doesn't have dropdown, navigate directly
//       handleMobileNavigation(item.href, item.name);
//     }
//   };

//   // Handle notification click
//   const handleNotificationClick = async (notificationId: string, e?: React.MouseEvent) => {
//     if (e) {
//       e.stopPropagation();
//     }
    
//     try {
//       await markAsRead(notificationId).unwrap();
//       refetchNotifications(); // Refresh notifications list
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   // Mark all as read
//   const handleMarkAllAsRead = async (e: React.MouseEvent) => {
//     e.stopPropagation();
    
//     try {
//       const unreadIds = unreadNotifications.map((n: any) => n.id || n._id);
//       for (const id of unreadIds) {
//         await markAsRead(id).unwrap();
//       }
//       refetchNotifications(); // Refresh notifications list
//     } catch (error) {
//       console.error("Error marking all as read:", error);
//     }
//   };

//   // Notification component
//   const NotificationBell = () => (
//     <div className="relative" ref={notificationRef}>
//       <button
//         onClick={() => {
//           setNotificationOpen(!notificationOpen);
//           setProfileDropdownOpen(false);
//           setDropdownOpen(null);
//         }}
//         className="relative p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all duration-200 group"
//         aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//       >
//         <Bell className="w-5 h-5" />
//         {unreadCount > 0 && (
//           <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
//         )}
//       </button>

//       {/* Notification Dropdown */}
//       {notificationOpen && isAuthenticated && (
//         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="font-semibold">Notifications</h3>
//             <div className="flex items-center space-x-2">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleMarkAllAsRead}
//                   className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setNotificationOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 ml-2"
//                 aria-label="Close notifications"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
          
//           <div className="max-h-96 overflow-y-auto">
//             {notificationsLoading ? (
//               <div className="p-4 text-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
//                 <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className="p-4 text-center text-gray-500">
//                 No notifications yet
//               </p>
//             ) : (
//               notifications.map((notification: any) => (
//                 <div
//                   key={notification.id || notification._id}
//                   className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
//                     !notification.isRead ? "bg-blue-50" : ""
//                   }`}
//                   onClick={(e) => handleNotificationClick(notification.id || notification._id, e)}
//                 >
//                   <h4 className="font-medium">
//                     {notification.notification?.title || notification.title || "Notification"}
//                   </h4>
//                   <p className="text-sm text-gray-600 mt-1">
//                     {notification.notification?.message || 
//                      notification.message || 
//                      notification.body || 
//                      "No message"}
//                   </p>
//                   <div className="flex justify-between items-center mt-2">
//                     <span className="text-xs text-gray-500">
//                       {notification.createdAt ? 
//                         new Date(notification.createdAt).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric',
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         }) : 
//                         "Recently"}
//                     </span>
//                     {!notification.isRead && (
//                       <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded animate-pulse">
//                         New
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
          
//           {notifications.length > 0 && (
//             <div className="p-3 border-t">
//               <Link
//                 href="/notifications"
//                 className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex justify-center"
//                 onClick={() => setNotificationOpen(false)}
//               >
//                 View All Notifications
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   // Mobile Notification Bell Component
//   const MobileNotificationBell = () => (
//     <div className="relative">
//       <button
//         onClick={() => {
//           setNotificationOpen(!notificationOpen);
//           setBottomDropdownOpen(null);
//         }}
//         className="relative p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-all duration-200"
//         aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
//       >
//         <Bell className="w-5 h-5" />
//         {unreadCount > 0 && (
//           <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
//         )}
//       </button>

//       {/* Mobile Notification Dropdown */}
//       {notificationOpen && isAuthenticated && (
//         <div className="absolute -right-4 -top-4 mt-2 w-screen max-w-xs bg-white rounded-lg shadow-xl border z-50 max-h-[70vh]">
//           <div className="p-4 border-b flex justify-between items-center">
//             <h3 className="font-semibold">Notifications</h3>
//             <div className="flex items-center space-x-2">
//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleMarkAllAsRead}
//                   className="text-xs text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Mark all read
//                 </button>
//               )}
//               <button
//                 onClick={() => setNotificationOpen(false)}
//                 className="text-gray-500 hover:text-gray-700 ml-2"
//                 aria-label="Close notifications"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
          
//           <div className="max-h-64 overflow-y-auto">
//             {notificationsLoading ? (
//               <div className="p-4 text-center">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
//                 <p className="text-sm text-gray-500 mt-2">Loading...</p>
//               </div>
//             ) : notifications.length === 0 ? (
//               <p className="p-4 text-center text-gray-500">
//                 No notifications yet
//               </p>
//             ) : (
//               notifications.slice(0, 5).map((notification: any) => (
//                 <div
//                   key={notification.id || notification._id}
//                   className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
//                     !notification.isRead ? "bg-blue-50" : ""
//                   }`}
//                   onClick={(e) => handleNotificationClick(notification.id || notification._id, e)}
//                 >
//                   <h4 className="font-medium text-sm">
//                     {notification.notification?.title || notification.title || "Notification"}
//                   </h4>
//                   <p className="text-xs text-gray-600 mt-1 line-clamp-2">
//                     {notification.notification?.message || 
//                      notification.message || 
//                      notification.body || 
//                      "No message"}
//                   </p>
//                   <div className="flex justify-between items-center mt-2">
//                     <span className="text-xs text-gray-500">
//                       {notification.createdAt ? 
//                         new Date(notification.createdAt).toLocaleDateString('en-US', {
//                           month: 'short',
//                           day: 'numeric'
//                         }) : 
//                         "Recently"}
//                     </span>
//                     {!notification.isRead && (
//                       <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
//                         New
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
          
//           {notifications.length > 0 && (
//             <div className="p-3 border-t">
//               <Link
//                 href="/notifications"
//                 className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium flex justify-center"
//                 onClick={() => setNotificationOpen(false)}
//               >
//                 View All
//               </Link>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <>
//       <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
//         <div className="w-full px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16 w-full">
//             {/* Logo and Desktop Navigation */}
//             <div className="flex items-center flex-1">
//               {/* Logo - Professional Design */}
//               <div className="relative h-10 w-20 md:h-12 md:w-28 lg:h-16 lg:w-32">
//                 <Link href="/">
//                   <Image
//                     src={Logo}
//                     alt="Company Logo"
//                     fill
//                     className="object-contain cursor-pointer"
//                     sizes="(max-width: 768px) 80px, (max-width: 1024px) 112px, 128px"
//                     priority
//                   />
//                 </Link>
//               </div>

//               {/* Desktop Navigation - Hidden on medium screens */}
//               <div className="hidden lg:flex lg:ml-10 lg:items-center lg:space-x-8">
//                 {navItems.map((item) => (
//                   <div key={item.name} className="relative">
//                     {item.dropdown ? (
//                       <div className="relative">
//                         <button
//                           className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${
//                             isActive(item.name)
//                               ? " text-primary"
//                               : "text-gray-700 hover:text-primary"
//                           }`}
//                           onMouseEnter={() => setDropdownOpen(item.name)}
//                           onMouseLeave={() => setDropdownOpen(null)}
//                         >
//                           <span className="relative">
//                             {item.name}
//                             <span
//                               className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
//                                 isActive(item.name)
//                                   ? "w-full"
//                                   : "w-0 group-hover:w-full"
//                               }`}
//                             ></span>
//                           </span>
//                           <ChevronDown
//                             className={`w-3 h-3 transition-transform ${dropdownOpen === item.name ? "rotate-180" : ""}`}
//                           />
//                         </button>

//                         {dropdownOpen === item.name && (
//                           <div
//                             className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-lg shadow-xl py-3 border border-gray-100 z-50 mt-1"
//                             onMouseEnter={() => setDropdownOpen(item.name)}
//                             onMouseLeave={() => setDropdownOpen(null)}
//                           >
//                             {item.dropdown.map((subItem) => (
//                               <Link
//                                 key={subItem.name}
//                                 href={subItem.href}
//                                 className="flex items-center px-5 py-2.5 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
//                                 onClick={() => handleItemClick(item.name)}
//                               >
//                                 <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
//                                 <span className="font-medium text-sm">
//                                   {subItem.name}
//                                 </span>
//                               </Link>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     ) : (
//                       <Link
//                         href={item.href}
//                         className={`flex items-center space-x-2 font-medium py-2 text-sm tracking-wide transition-all duration-200 group ${
//                           isActive(item.name)
//                             ? " text-primary"
//                             : "text-gray-700 hover:text-primary"
//                         }`}
//                         onClick={() => handleItemClick(item.name)}
//                       >
//                         <div
//                           className={
//                             isActive(item.name)
//                               ? "text-primary"
//                               : "text-gray-600 group-hover:text-primary"
//                           }
//                         >
//                           {item.icon}
//                         </div>
//                         <span className="relative">
//                           {item.name}
//                           <span
//                             className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
//                               isActive(item.name)
//                                 ? "w-full"
//                                 : "w-0 group-hover:w-full"
//                             }`}
//                           ></span>
//                         </span>
//                       </Link>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right side - Desktop (768px+) */}
//             <div className="hidden md:flex md:items-center md:space-x-6">
//               {/* Search - Professional Design */}
//               <div className="relative" ref={searchRef}>
//                 <form onSubmit={handleSearch} className="flex items-center">
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-10 pr-9 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-48 lg:w-56 transition-all duration-200 text-sm"
//                     />
//                     <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
//                     {searchQuery && (
//                       <button
//                         type="button"
//                         onClick={() => setSearchQuery("")}
//                         className="absolute right-3 top-2.5"
//                       >
//                         <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
//                       </button>
//                     )}
//                   </div>
//                 </form>
//               </div>

//               {/* Conditional rendering based on authentication */}
//               {isAuthenticated ? (
//                 <>
//                   {/* Notification Bell - Desktop */}
//                   <NotificationBell />

//                   {/* Profile with Dropdown */}
//                   <div className="relative" ref={profileDropdownRef}>
//                     <button
//                       className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:opacity-90 transition-opacity"
//                       onClick={() =>
//                         setProfileDropdownOpen(!profileDropdownOpen)
//                       }
//                     >
//                       <div className="relative">
//                         {user?.avatar ? (
//                           <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full overflow-hidden">
//                             <Image
//                               src={user.avatar}
//                               alt={user.name || "User"}
//                               width={36}
//                               height={36}
//                               className="object-cover"
//                             />
//                           </div>
//                         ) : (
//                           <div className="h-8 w-8 lg:h-9 lg:w-9 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
//                             <span className="text-white font-semibold text-xs lg:text-sm">
//                               {user?.name ? getInitials(user.name) : "U"}
//                             </span>
//                           </div>
//                         )}
//                         <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 lg:h-3 lg:w-3 bg-green-500 rounded-full border-2 border-white"></div>
//                       </div>
//                       <div className="hidden lg:block text-left">
//                         <p className="text-sm font-semibold text-gray-900 truncate max-w-30">
//                           {user?.name || "User"}
//                         </p>
//                         <p className="text-xs text-gray-500 capitalize">
//                           {user?.role?.replace(/_/g, " ") || "User"}
//                         </p>
//                       </div>
//                       <ChevronDown
//                         className={`w-4 h-4 text-gray-400 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`}
//                       />
//                     </button>

//                     {/* Profile Dropdown Menu */}
//                     {profileDropdownOpen && (
//                       <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
//                         <div className="px-4 py-2 border-b border-gray-100">
//                           <p className="text-sm font-semibold text-gray-900 truncate">
//                             {user?.name || "User"}
//                           </p>
//                           <p className="text-xs text-gray-500 truncate">
//                             {user?.email || ""}
//                           </p>
//                         </div>
//                         <Link
//                           href="/dashboard"
//                           className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
//                           onClick={() => setProfileDropdownOpen(false)}
//                         >
//                           <LayoutDashboard className="w-4 h-4 mr-3" />
//                           <span className="font-medium text-sm">Dashboard</span>
//                         </Link>
//                         <Link
//                           href="/notifications"
//                           className="flex items-center px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
//                           onClick={() => setProfileDropdownOpen(false)}
//                         >
//                           <Bell className="w-4 h-4 mr-3" />
//                           <span className="font-medium text-sm">All Notifications</span>
//                           {unreadCount > 0 && (
//                             <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                               {unreadCount}
//                             </span>
//                           )}
//                         </Link>
//                         <button
//                           className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200"
//                           onClick={handleLogout}
//                         >
//                           <LogOut className="w-4 h-4 mr-3" />
//                           <span className="font-medium text-sm">Log Out</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 // Login Button for non-authenticated users
//                 <Link
//                   href="/login"
//                   className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm"
//                 >
//                   <LogIn className="w-4 h-4" />
//                   <span>Login</span>
//                 </Link>
//               )}
//             </div>

//             {/* Mobile Search & Menu - Show on small screens */}
//             <div className="flex items-center space-x-2 md:hidden">
//               {/* Mobile Notification Bell - Only show if authenticated */}
//               {isAuthenticated && (
//                 <MobileNotificationBell />
//               )}

//               {/* Mobile Search Button */}
//               <button
//                 onClick={() => setSearchOpen(!searchOpen)}
//                 className="p-2 text-gray-600 hover:text-primary rounded-full hover:bg-primary/5 transition-colors duration-200"
//               >
//                 <Search className="w-5 h-5" />
//               </button>

//               {/* Mobile Menu Button */}
//               <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200 focus:outline-none"
//               >
//                 {isOpen ? (
//                   <X className="w-5 h-5" />
//                 ) : (
//                   <Menu className="w-5 h-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Mobile Search Bar - Professional Design */}
//           {searchOpen && (
//             <div
//               className="md:hidden py-3 border-t border-gray-200 bg-white"
//               ref={searchRef}
//             >
//               <div className="px-2">
//                 <form onSubmit={handleSearch} className="flex items-center">
//                   <div className="relative flex-1">
//                     <input
//                       type="text"
//                       placeholder="Search for anything..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="w-full pl-10 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
//                       autoFocus
//                     />
//                     <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
//                     {searchQuery && (
//                       <button
//                         type="button"
//                         onClick={() => setSearchQuery("")}
//                         className="absolute right-3 top-3"
//                       >
//                         <XCircle className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 transition-colors" />
//                       </button>
//                     )}
//                   </div>
//                   <button
//                     type="submit"
//                     className="ml-2 px-3 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 text-sm font-medium"
//                   >
//                     Search
//                   </button>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Medium Screen Navigation (768px - 1024px) - Professional Design */}
//         <div className="hidden md:flex lg:hidden border-t border-gray-100 bg-gray-50/50">
//           <div className="w-full">
//             <div className="flex items-center justify-center space-x-6 py-2 px-4">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center space-x-1.5 font-medium text-xs transition-all duration-200 group relative px-2 py-1.5 rounded-lg ${
//                     isActive(item.name)
//                       ? " bg-primary/10 text-primary"
//                       : "text-gray-600 hover:text-primary hover:bg-primary/5"
//                   }`}
//                   onClick={() => handleItemClick(item.name)}
//                 >
//                   <div className="text-gray-600 group-hover:text-primary">
//                     {item.icon}
//                   </div>
//                   <span className="font-medium whitespace-nowrap">
//                     {item.name}
//                   </span>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Bottom Navigation - Separate Dropdown Logic */}
//       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
//         <div className="flex justify-around items-center h-14 px-1">
//           {navItems.map((item) => (
//             <div
//               key={item.name}
//               className="relative flex-1"
//               ref={bottomDropdownRef}
//             >
//               <div
//                 onClick={() => handleBottomItemClick(item)}
//                 className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative mx-1 rounded-lg cursor-pointer ${
//                   isActive(item.name) ? " bg-primary/5" : "hover:bg-primary/5"
//                 }`}
//               >
//                 <div
//                   className={`relative mb-0.5 transition-transform duration-200 ${
//                     isActive(item.name) ? "-translate-y-0.5" : ""
//                   }`}
//                 >
//                   <div
//                     className={
//                       isActive(item.name) ? "text-primary" : "text-gray-600"
//                     }
//                   >
//                     {item.icon}
//                   </div>
//                   {isActive(item.name) && (
//                     <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full"></div>
//                   )}
//                 </div>
//                 <span
//                   className={`text-[10px] font-medium transition-colors ${
//                     isActive(item.name) ? "text-primary" : "text-gray-600"
//                   }`}
//                 >
//                   {item.name}
//                 </span>
//               </div>

//               {/* Separate Bottom Navigation Dropdown for Services */}
//               {item.dropdown && bottomDropdownOpen === item.name && (
//                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-white rounded-lg shadow-xl py-2 border border-gray-100 z-50">
//                   {item.dropdown.map((subItem) => (
//                     <div
//                       key={subItem.name}
//                       className="px-4 py-2"
//                       onClick={() => {
//                         handleMobileNavigation(subItem.href, item.name);
//                         setBottomDropdownOpen(null);
//                       }}
//                     >
//                       <div className="flex items-center text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group cursor-pointer rounded px-2 py-1.5">
//                         <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
//                         <span className="font-medium text-xs">
//                           {subItem.name}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}

//           {/* Mobile Bottom Notification Button */}
//           {isAuthenticated && (
//             <div className="relative flex-1">
//               <div
//                 onClick={() => {
//                   setNotificationOpen(!notificationOpen);
//                   setBottomDropdownOpen(null);
//                 }}
//                 className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative mx-1 rounded-lg hover:bg-primary/5 cursor-pointer"
//               >
//                 <div className="relative mb-0.5">
//                   <Bell className="w-5 h-5 text-gray-600" />
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full ring-1 ring-white"></span>
//                   )}
//                 </div>
//                 <span className="text-[10px] font-medium text-gray-600">
//                   Notifications
//                 </span>
//               </div>
//             </div>
//           )}

//           {/* Mobile Bottom Profile/Login Button */}
//           <div className="relative flex-1" ref={bottomDropdownRef}>
//             {isAuthenticated ? (
//               <>
//                 <div
//                   onClick={() => {
//                     setBottomDropdownOpen(
//                       bottomDropdownOpen === "profile" ? null : "profile",
//                     );
//                   }}
//                   className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative mx-1 rounded-lg hover:bg-primary/5 cursor-pointer"
//                 >
//                   <div className="relative mb-0.5">
//                     {user?.avatar ? (
//                       <div className="h-5 w-5 rounded-full overflow-hidden">
//                         <Image
//                           src={user.avatar}
//                           alt={user.name || "User"}
//                           width={20}
//                           height={20}
//                           className="object-cover"
//                         />
//                       </div>
//                     ) : (
//                       <div className="h-5 w-5 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
//                         <span className="text-white text-xs font-semibold">
//                           {user?.name ? getInitials(user.name) : "U"}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                   <span className="text-[10px] font-medium text-gray-600">
//                     Profile
//                   </span>
//                 </div>

//                 {/* Mobile Bottom Profile Dropdown */}
//                 {bottomDropdownOpen === "profile" && (
//                   <div className="absolute bottom-full -left-2 -translate-x-1/2 mb-2 w-40 bg-white rounded-lg shadow-xl py-2 border border-primary z-50">
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <p className="text-sm font-semibold text-gray-900 truncate">
//                         {user?.name || "User"}
//                       </p>
//                       <p className="text-xs text-gray-500 truncate">
//                         {user?.email || ""}
//                       </p>
//                     </div>
//                     <div
//                       className="px-4 py-2"
//                       onClick={() => {
//                         handleMobileNavigation("/dashboard", "Dashboard");
//                         setBottomDropdownOpen(null);
//                       }}
//                     >
//                       <div className="flex items-center text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group cursor-pointer rounded px-2 py-1.5">
//                         <LayoutDashboard className="w-4 h-4 mr-2" />
//                         <span className="font-medium text-sm">Dashboard</span>
//                       </div>
//                     </div>
//                     <div
//                       className="px-4 py-2"
//                       onClick={() => {
//                         handleMobileNavigation("/notifications", "Notifications");
//                         setBottomDropdownOpen(null);
//                       }}
//                     >
//                       <div className="flex items-center text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group cursor-pointer rounded px-2 py-1.5">
//                         <Bell className="w-4 h-4 mr-2" />
//                         <span className="font-medium text-sm">All Notifications</span>
//                         {unreadCount > 0 && (
//                           <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                             {unreadCount}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="px-4 py-2" onClick={handleLogout}>
//                       <div className="flex items-center text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group cursor-pointer rounded px-2 py-1.5">
//                         <LogOut className="w-4 h-4 mr-2" />
//                         <span className="font-medium text-sm">Log Out</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div
//                 onClick={() => handleMobileNavigation("/login", "Login")}
//                 className="flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative mx-1 rounded-lg hover:bg-primary/5 cursor-pointer"
//               >
//                 <div className="relative mb-0.5">
//                   <LogIn className="w-5 h-5 text-gray-600" />
//                 </div>
//                 <span className="text-[10px] font-medium text-gray-600">
//                   Login
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu Overlay - Separate Dropdown Logic */}
//       {isOpen && (
//         <div
//           className="md:hidden fixed inset-0 bg-black/20 z-40"
//           onClick={() => setIsOpen(false)}
//         >
//           <div
//             className="absolute top-16 bottom-14 left-0 right-0 bg-white shadow-xl overflow-y-auto"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="p-4 h-full">
//               {/* Conditional Mobile Profile Section */}
//               {isAuthenticated ? (
//                 <div className="flex items-center space-x-3 p-3 mb-4 bg-linear-to-r from-primary/5 to-primary/10 rounded-xl">
//                   <div className="relative">
//                     {user?.avatar ? (
//                       <div className="h-10 w-10 rounded-full overflow-hidden">
//                         <Image
//                           src={user.avatar}
//                           alt={user.name || "User"}
//                           width={40}
//                           height={40}
//                           className="object-cover"
//                         />
//                       </div>
//                     ) : (
//                       <div className="h-10 w-10 bg-linear-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
//                         <span className="text-white font-bold text-sm">
//                           {user?.name ? getInitials(user.name) : "U"}
//                         </span>
//                       </div>
//                     )}
//                     <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-bold text-gray-900 text-sm truncate">
//                       {user?.name || "User"}
//                     </p>
//                     <p className="text-xs text-gray-600 capitalize truncate">
//                       {user?.role?.replace(/_/g, " ") || "User"}
//                     </p>
//                   </div>
//                   <div className="relative">
//                     <button 
//                       className="p-1.5 text-gray-600 hover:text-primary relative"
//                       onClick={() => setNotificationOpen(!notificationOpen)}
//                     >
//                       <Bell className="w-4 h-4" />
//                       {unreadCount > 0 && (
//                         <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-red-500 rounded-full ring-1 ring-white"></span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-4">
//                   <div
//                     onClick={() => handleMobileNavigation("/login", "Login")}
//                     className="w-full bg-primary text-white px-3 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow flex items-center justify-center space-x-2 cursor-pointer"
//                   >
//                     <LogIn className="w-4 h-4" />
//                     <span>Login to your account</span>
//                   </div>
//                 </div>
//               )}

//               {/* Mobile Navigation Items - Separate Dropdown Logic */}
//               <div className="space-y-0.5">
//                 {navItems.map((item) => (
//                   <div
//                     key={item.name}
//                     className="border-b border-gray-100 last:border-b-0"
//                   >
//                     {item.dropdown ? (
//                       <>
//                         <button
//                           onClick={() => {
//                             toggleDropdown(item.name, "navbar");
//                           }}
//                           className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 ${
//                             isActive(item.name)
//                               ? " bg-primary/10 text-primary"
//                               : "text-gray-800 hover:bg-primary/5 hover:text-primary"
//                           }`}
//                         >
//                           <div className="flex items-center space-x-3">
//                             <div
//                               className={`${isActive(item.name) ? "text-primary" : "text-gray-600"}`}
//                             >
//                               {item.icon}
//                             </div>
//                             <span className="font-medium text-sm">{item.name}</span>
//                           </div>
//                           <ChevronDown
//                             className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen === item.name ? "rotate-180" : ""}`}
//                           />
//                         </button>

//                         {/* Navbar Mobile Dropdown - Separate from Bottom */}
//                         {dropdownOpen === item.name && (
//                           <div className="ml-10 mt-1 mb-2 space-y-1">
//                             {item.dropdown.map((subItem) => (
//                               <div
//                                 key={subItem.name}
//                                 className="px-3 py-2"
//                                 onClick={() => {
//                                   handleMobileNavigation(subItem.href, item.name);
//                                   setIsOpen(false);
//                                 }}
//                               >
//                                 <div className="flex items-center text-gray-600 hover:text-primary transition-colors duration-200 group rounded-lg hover:bg-primary/5 cursor-pointer px-2 py-1.5">
//                                   <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
//                                   <span className="font-medium text-sm">
//                                     {subItem.name}
//                                   </span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </>
//                     ) : (
//                       <div
//                         onClick={() => {
//                           handleMobileNavigation(item.href, item.name);
//                           setIsOpen(false);
//                         }}
//                         className={`flex items-center justify-between w-full px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
//                           isActive(item.name)
//                             ? " bg-primary/10 text-primary"
//                             : "text-gray-800 hover:bg-primary/5 hover:text-primary"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <div
//                             className={`${isActive(item.name) ? "text-primary" : "text-gray-600"}`}
//                           >
//                             {item.icon}
//                           </div>
//                           <span className="font-medium text-sm">{item.name}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Mobile Footer Actions - Conditional */}
//               {isAuthenticated && (
//                 <div className="mt-6 pt-4 border-t border-gray-200">
//                   <div
//                     onClick={() => handleMobileNavigation("/dashboard", "Dashboard")}
//                     className="w-full bg-primary text-white px-3 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow flex items-center justify-center space-x-2 mb-2 cursor-pointer"
//                   >
//                     <LayoutDashboard className="w-4 h-4" />
//                     <span>Dashboard</span>
//                   </div>
//                   <div
//                     onClick={() => handleMobileNavigation("/notifications", "Notifications")}
//                     className="w-full border border-primary text-primary px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 mb-2 cursor-pointer"
//                   >
//                     <Bell className="w-4 h-4" />
//                     <span>View All Notifications</span>
//                     {unreadCount > 0 && (
//                       <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </div>
//                   <div
//                     onClick={handleLogout}
//                     className="w-full border border-gray-300 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2 cursor-pointer"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     <span>Log Out</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Mobile Notification Panel - Show when notificationOpen is true */}
//       {notificationOpen && isAuthenticated && !isOpen && (
//         <div className="md:hidden fixed inset-0 bg-black/20 z-50">
//           <div className="absolute top-0 left-0 right-0 bg-white shadow-xl h-3/4 rounded-b-2xl overflow-hidden">
//             <div className="p-4 border-b flex justify-between items-center">
//               <h3 className="font-bold text-lg">Notifications</h3>
//               <div className="flex items-center space-x-4">
//                 {unreadCount > 0 && (
//                   <button
//                     onClick={handleMarkAllAsRead}
//                     className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                   >
//                     Mark all read
//                   </button>
//                 )}
//                 <button
//                   onClick={() => setNotificationOpen(false)}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✕
//                 </button>
//               </div>
//             </div>
            
//             <div className="h-full overflow-y-auto p-4">
//               {notificationsLoading ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                   <p className="text-gray-500 mt-4">Loading notifications...</p>
//                 </div>
//               ) : notifications.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <Bell className="w-12 h-12 text-gray-300 mb-4" />
//                   <p className="text-gray-500 text-center">No notifications yet</p>
//                   <p className="text-gray-400 text-sm text-center mt-2">
//                     We'll notify you when something important happens
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {notifications.map((notification: any) => (
//                     <div
//                       key={notification.id || notification._id}
//                       className={`p-3 rounded-lg border ${
//                         !notification.isRead 
//                           ? "bg-blue-50 border-blue-100" 
//                           : "bg-white border-gray-200"
//                       }`}
//                       onClick={(e) => handleNotificationClick(notification.id || notification._id, e)}
//                     >
//                       <div className="flex justify-between items-start">
//                         <h4 className="font-medium">
//                           {notification.notification?.title || notification.title || "Notification"}
//                         </h4>
//                         {!notification.isRead && (
//                           <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
//                             New
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 mt-1">
//                         {notification.notification?.message || 
//                          notification.message || 
//                          notification.body || 
//                          "No message"}
//                       </p>
//                       <div className="flex justify-between items-center mt-2">
//                         <span className="text-xs text-gray-500">
//                           {notification.createdAt ? 
//                             new Date(notification.createdAt).toLocaleDateString('en-US', {
//                               month: 'short',
//                               day: 'numeric',
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             }) : 
//                             "Recently"}
//                         </span>
//                         <button
//                           className="text-xs text-blue-600 hover:text-blue-800"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleNotificationClick(notification.id || notification._id, e);
//                           }}
//                         >
//                           {notification.isRead ? "Read" : "Mark as read"}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div className="p-4 border-t bg-gray-50">
//               <Link
//                 href="/notifications"
//                 className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm flex items-center justify-center"
//                 onClick={() => setNotificationOpen(false)}
//               >
//                 View All Notifications
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;


// src/components/navbar/index.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useLogOutMutation } from "@/src/redux/features/auth/authApi";
import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation } from "@/src/redux/features/notification/notificationApi";
import { Home, User, Briefcase, Mail, LogIn } from "lucide-react";

// Import components
import NavLogo from "./NavLogo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";
import SearchBar from "./SearchBar";
import { NavItem } from "./types";
import Link from "next/link";

// Nav items configuration
const navItems: NavItem[] = [
  {
    name: "Home",
    icon: <Home className="w-4 h-4" />,
    href: "/",
    exact: true,
  },
  { name: "About", icon: <User className="w-4 h-4" />, href: "/about" },
  {
    name: "Services",
    icon: <Briefcase className="w-4 h-4" />,
    href: "/services",
    dropdown: [
      { name: "Web Development", href: "/services/web-development" },
      { name: "Mobile Apps", href: "/services/mobile-apps" },
      { name: "UI/UX Design", href: "/services/ui-ux" },
      { name: "Consulting", href: "/services/consulting" },
    ],
  },
  { name: "Contact", icon: <Mail className="w-4 h-4" />, href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State
  const [activeItem, setActiveItem] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Redux
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogOutMutation();

  // Notification APIs
  const { data: notificationResponse, refetch: refetchNotifications, isLoading: notificationsLoading } = useGetUserNotificationsQuery(user?.id || "", {
    skip: !user?.id,
    pollingInterval: 60000,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();

  // Extract notifications
  const notifications = (() => {
    if (!notificationResponse) return [];
    
    if (Array.isArray(notificationResponse)) {
      return notificationResponse;
    }
    
    if (notificationResponse.data && Array.isArray(notificationResponse.data)) {
      return notificationResponse.data;
    }
    
    for (const key in notificationResponse) {
      if (Array.isArray(notificationResponse[key])) {
        return notificationResponse[key];
      }
    }
    
    return [];
  })();

  const unreadNotifications = notifications.filter((n: any) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  // Effects
  useEffect(() => {
    const currentItem = navItems.find((item) => {
      if (item.exact) {
        return pathname === item.href;
      }
      return pathname.startsWith(item.href);
    });
    if (currentItem) {
      setActiveItem(currentItem.name);
    }
  }, [pathname]);

  // Handlers
  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    setIsOpen(false);
    setDropdownOpen(null);
  };

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationClick = async (notificationId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    try {
      await markAsRead(notificationId).unwrap();
      refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const unreadIds = unreadNotifications.map((n: any) => n.id || n._id);
      for (const id of unreadIds) {
        await markAsRead(id).unwrap();
      }
      refetchNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
    // Implement search logic here
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 w-full">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center flex-1">
              <NavLogo />
              <DesktopNav
                navItems={navItems}
                activeItem={activeItem}
                dropdownOpen={dropdownOpen}
                setDropdownOpen={setDropdownOpen}
                onItemClick={handleItemClick}
              />
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <SearchBar variant="desktop" onSearch={handleSearch} />
              
              {isAuthenticated ? (
                <>
                  <NotificationBell
                    isAuthenticated={isAuthenticated}
                    notifications={notifications}
                    notificationsLoading={notificationsLoading}
                    unreadCount={unreadCount}
                    onNotificationClick={handleNotificationClick}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    refetchNotifications={refetchNotifications}
                    variant="desktop"
                  />
                  
                  <ProfileDropdown
                    user={user}
                    unreadCount={unreadCount}
                    onLogout={handleLogout}
                  />
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Navigation */}
            <MobileNav
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              navItems={navItems}
              activeItem={activeItem}
              isAuthenticated={isAuthenticated}
              user={user}
              notifications={notifications}
              notificationsLoading={notificationsLoading}
              unreadCount={unreadCount}
              onNotificationClick={handleNotificationClick}
              onMarkAllAsRead={handleMarkAllAsRead}
              refetchNotifications={refetchNotifications}
              onLogout={handleLogout}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </nav>
    </>
  );
}