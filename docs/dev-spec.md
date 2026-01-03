# Screen Definitions

These are the specific pages (Routes) the user will interact with.

A. Authentication Group (auth)
Login Screen (login.tsx)

Goal: User signs in to access writing reviews.

Key Elements: Email Input, Password Input, "Sign In" Button, "Don't have an account? Sign up" link.

Register Screen (register.tsx)

Goal: Create a new user in your Postgres DB.

Key Elements: Username (unique), Email, Password, Confirm Password, "Create Account" Button.

B. Main App Group (tabs)
Home Feed (index.tsx)

Goal: Discovery. Shows "Now Playing" and "Trending."

Layout:

Header: App Title ("CineRate").

Section 1: Horizontal Scroll of "Trending Movies" (Large Cards).

Section 2: Vertical Grid/List of "Now Playing" (Smaller Cards).

Search (search.tsx)

Goal: Find a specific movie to review.

Layout:

Top: Search Bar (Sticky).

Body: Empty State ("Search for a movie...") -> Loading Spinner -> List of Results (from TMDB).

Profile (profile.tsx)

Goal: User management and review history.

Layout:

Top: User Avatar, Username, Review Count stat.

Body: List of reviews this user has written (fetched from your Postgres DB).

Action: Logout Button (Top right or bottom).

C. Movie Details Group
Movie Details (app/movie/[id].tsx)

Goal: View info and read/write reviews.

Layout: Parallax ScrollView.

Hero: Backdrop image + Poster overlap.

Info: Title, Release Year, Genres, TMDB Rating (0-10).

Overview: Text block (Synopsis).

Community Reviews: List of reviews from your app users.

FAB (Floating Action Button): "Rate Movie" (triggers the modal).

D. Modals / Overlays
Write Review Modal (app/movie/[id]/review.tsx)

Note: In Expo Router, this can be presented as a presentation: 'modal' or a Bottom Sheet.

Elements:

Header: "Rate [Movie Name]".

Star/Slider Input: 1 to 5 stars.

Text Area: "What did you think?"

Submit Button.

The "List" Strategy: For the Home feed and Reviews list, utilize @shopify/flash-list (it's faster than React Native's FlatList and works great with Expo).

Home Screen: Use a FlashList with a numColumns={2} for a grid view of movie posters.

Details Screen: Use a ScrollView, but nest a FlashList inside for the reviews if there are many (or just map them if you limit to top 5).

# Google AI Studio Mockups References (To-be transformed to React Native pages and modular components instead, utilizing Uniwind)

## Login

<!-- Login Screen -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CineRate Login</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&amp;family=Noto+Sans:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#0db9f2",
                        "background-light": "#f5f8f8",
                        "background-dark": "#101e22",
                    },
                    fontFamily: {
                        "display": ["Be Vietnam Pro", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
<!-- Main Container -->
<div class="relative flex min-h-screen w-full flex-col overflow-hidden">
<!-- Background Image with Gradient Overlay -->
<div class="absolute inset-0 z-0">
<div class="absolute inset-0 bg-gradient-to-b from-background-dark/80 via-background-dark/90 to-background-dark z-10"></div>
<div class="h-full w-full bg-cover bg-center opacity-40" data-alt="Abstract dark cinema background with blurred movie lights" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkVbxKg37-VC1pWjY6QrpT7hn3TOelPoh4EtSWBsSvZURCoznfarm3EohvgBR56fxf6hky4E8a9FY6iB4UATUIRkbthpF7l2eXH6LC-wIcqIBH1LtYMxX3IMaYDa4TevhyGGrceZzwr_ZbsOJm-XMjb8puG3ceroBqdX_qOKYGGfWBxI3VmROFNyfGzRYn1Qb3yqMgrTuMiZmp_mp4sTvvSYjt_rebxjF76pqM4GX0Aadm-raAcNsp3Mb4s11gyLNfSdX--FWeqIw');">
</div>
</div>
<!-- Content Wrapper -->
<div class="relative z-20 flex flex-1 flex-col justify-between px-6 py-10">
<!-- Top Section: Logo & Welcome -->
<div class="flex flex-col items-center pt-10 space-y-8">
<!-- Logo -->
<div class="flex flex-col items-center gap-3">
<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(13,185,242,0.3)]">
<span class="material-symbols-outlined text-primary text-4xl">movie_filter</span>
</div>
<h1 class="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
                        Cine<span class="text-primary">Rate</span>
</h1>
</div>
<!-- Headline -->
<div class="text-center space-y-2">
<h2 class="text-2xl font-bold text-white">Welcome back!</h2>
<p class="text-slate-400 text-sm">Sign in to discover your next favorite movie.</p>
</div>
</div>
<!-- Middle Section: Form -->
<div class="w-full max-w-sm mx-auto space-y-6 mt-8">
<!-- Email Field -->
<div class="space-y-2">
<label class="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Email Address</label>
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-4 text-slate-400">mail</span>
<input class="w-full rounded-xl bg-[#1c2a30] border-transparent text-white placeholder-slate-500 focus:border-primary focus:bg-[#1f2e34] focus:ring-1 focus:ring-primary py-4 pl-12 pr-4 transition-all duration-200" placeholder="hello@cinerate.com" type="email"/>
</div>
</div>
<!-- Password Field -->
<div class="space-y-2">
<label class="text-xs font-medium text-slate-400 ml-1 uppercase tracking-wider">Password</label>
<div class="relative flex items-center">
<span class="material-symbols-outlined absolute left-4 text-slate-400">lock</span>
<input class="w-full rounded-xl bg-[#1c2a30] border-transparent text-white placeholder-slate-500 focus:border-primary focus:bg-[#1f2e34] focus:ring-1 focus:ring-primary py-4 pl-12 pr-12 transition-all duration-200" placeholder="••••••••" type="password"/>
<button class="absolute right-4 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
<span class="material-symbols-outlined" style="font-size: 20px;">visibility</span>
</button>
</div>
<div class="flex justify-end pt-1">
<a class="text-sm text-primary hover:text-primary/80 font-medium transition-colors" href="#">Forgot Password?</a>
</div>
</div>
<!-- Sign In Button -->
<button class="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transform transition active:scale-[0.98] duration-200 text-lg">
                    Sign In
                </button>
<!-- Divider -->
<div class="relative py-2">
<div class="absolute inset-0 flex items-center">
<div class="w-full border-t border-slate-700"></div>
</div>
<div class="relative flex justify-center text-sm">
<span class="bg-background-dark px-2 text-slate-500">Or continue with</span>
</div>
</div>
<!-- Social Login Buttons -->
<div class="grid grid-cols-2 gap-4">
<button class="flex items-center justify-center gap-2 bg-[#1c2a30] hover:bg-[#25363d] text-white py-3 rounded-xl border border-slate-700 transition-all duration-200">
<!-- Apple Icon substitute using text for strict no-svg rule, or just generic icon -->
<span class="material-symbols-outlined" style="font-size: 20px;">ios</span>
<span class="font-medium text-sm">Apple</span>
</button>
<button class="flex items-center justify-center gap-2 bg-[#1c2a30] hover:bg-[#25363d] text-white py-3 rounded-xl border border-slate-700 transition-all duration-200">
<!-- Google Icon substitute using text for strict no-svg rule, or just generic icon -->
<span class="text-lg font-bold">G</span>
<span class="font-medium text-sm">Google</span>
</button>
</div>
</div>
<!-- Bottom Section: Sign Up -->
<div class="mt-8 text-center pb-4">
<p class="text-slate-400 text-sm">
                    Don't have an account? 
                    <a class="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1" href="#">Sign up</a>
</p>
</div>
</div>
</div>
</body></html>

## Register

<!-- Register Screen -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CineRate - Register</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Config -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#0db9f2",
                        "background-light": "#f5f8f8",
                        "background-dark": "#101e22",
                        "surface-dark": "#16262c",
                        "input-dark": "#1b282d",
                    },
                    fontFamily: {
                        "display": ["Be Vietnam Pro", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        /* Custom scrollbar hide for cleaner mobile look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-white">
<div class="relative flex h-full min-h-screen w-full flex-col overflow-hidden">
<!-- Background Hero Element -->
<div class="absolute inset-0 z-0 h-full w-full">
<div class="absolute inset-0 bg-gradient-to-b from-background-dark/90 via-background-dark/95 to-background-dark z-10"></div>
<img alt="Cinema seats in a dark theater background" class="h-full w-full object-cover opacity-40" data-alt="Cinema seats in a dark theater background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoAJXN4vSmHA8kCxw-U2GRZo0_H_j-1vTImQ-7tLwjjwEZioHpRz40nilOGRkGyMp6Eq4z1PRIRl78ASnnFkm4oVQV8RBXD4Z7LQeIPUeTAUo9HwhPJ24w2Ckf_2bP6aszIOxTXG51Liu_gGmOtix8l_NFBBfOFzSwSszqDDbuONTJbB2DeJpvXz4gtZMPvbo5shIG-LUzMWGtqXidaMG4be_AG0XuVlTDm1-zdrxzTjH5uyPTta_d0UcJZtklCc0FHT4YT0eO_eM"/>
</div>
<!-- Content Wrapper -->
<div class="relative z-20 flex flex-1 flex-col h-full w-full max-w-md mx-auto">
<!-- TopAppBar -->
<div class="flex items-center p-4 pb-2 justify-between">
<button class="text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
</button>
<h2 class="text-white text-lg font-bold leading-tight tracking-wide flex-1 text-center pr-12">Create Account</h2>
</div>
<div class="flex-1 overflow-y-auto no-scrollbar px-4 pb-8">
<!-- Headline -->
<div class="pt-4 pb-6 text-center">
<div class="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10 ring-1 ring-primary/30">
<span class="material-symbols-outlined text-primary text-3xl">local_movies</span>
</div>
<h1 class="text-white tracking-tight text-3xl font-bold leading-tight mb-2">Join the Club</h1>
<p class="text-slate-400 text-sm font-medium">Start your journey to discover and rate movies.</p>
</div>
<!-- Form Inputs -->
<div class="space-y-5">
<!-- Username -->
<div class="flex flex-col gap-2">
<label class="text-slate-200 text-sm font-semibold leading-normal ml-1">Username</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">person</span>
</span>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-slate-700 bg-input-dark focus:border-primary h-14 placeholder:text-slate-500 pl-11 pr-4 text-base font-normal leading-normal transition-all duration-200" placeholder="MovieBuff99" type="text"/>
</div>
</div>
<!-- Email -->
<div class="flex flex-col gap-2">
<label class="text-slate-200 text-sm font-semibold leading-normal ml-1">Email</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">mail</span>
</span>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-slate-700 bg-input-dark focus:border-primary h-14 placeholder:text-slate-500 pl-11 pr-4 text-base font-normal leading-normal transition-all duration-200" placeholder="name@example.com" type="email"/>
</div>
</div>
<!-- Password -->
<div class="flex flex-col gap-2">
<label class="text-slate-200 text-sm font-semibold leading-normal ml-1">Password</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">lock</span>
</span>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-slate-700 bg-input-dark focus:border-primary h-14 placeholder:text-slate-500 pl-11 pr-12 text-base font-normal leading-normal transition-all duration-200" placeholder="••••••••" type="password"/>
<button class="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-500 hover:text-slate-300">
<span class="material-symbols-outlined text-[20px]">visibility_off</span>
</button>
</div>
</div>
<!-- Confirm Password -->
<div class="flex flex-col gap-2">
<label class="text-slate-200 text-sm font-semibold leading-normal ml-1">Confirm Password</label>
<div class="relative group">
<span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
<span class="material-symbols-outlined text-[20px]">verified_user</span>
</span>
<input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-slate-700 bg-input-dark focus:border-primary h-14 placeholder:text-slate-500 pl-11 pr-12 text-base font-normal leading-normal transition-all duration-200" placeholder="••••••••" type="password"/>
</div>
</div>
</div>
<!-- Terms -->
<div class="mt-6 text-xs text-center text-slate-500 px-4">
                    By signing up, you agree to our <a class="text-primary hover:underline" href="#">Terms of Service</a> and <a class="text-primary hover:underline" href="#">Privacy Policy</a>.
                </div>
<!-- Submit Button -->
<div class="mt-6">
<button class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 bg-primary text-white text-base font-bold leading-normal tracking-wide hover:bg-sky-400 active:scale-[0.98] transition-all shadow-[0_0_15px_rgba(13,185,242,0.3)]">
                        CREATE ACCOUNT
                    </button>
</div>
<!-- Social Login Section -->
<div class="mt-8 flex flex-col gap-4">
<div class="flex items-center gap-4 px-2">
<div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
<p class="text-slate-400 text-sm font-medium">Or sign up with</p>
<div class="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
</div>
<div class="flex justify-center gap-4 mt-2">
<!-- Apple -->
<button class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition-all">
<svg class="h-5 w-5 fill-current" role="img" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.247 9.818C12.39 8.783 12.984 7.822 13.844 7.23C13.064 6.273 11.902 5.922 10.96 5.947c-1.396.06-2.69.83-3.39 8.3-1.04-.047-2.66-.883-2.66-.883s-.292 1.62-.05 2.766c.21 1.01.996 1.838 1.94 2.217.96.386 2.396-.067 2.396-.067s.642 1.95 2.652 1.95c.575 0 1.258-.15 1.666-.346-1.554-1.226-2.193-2.906-1.21-4.708zm4.776-6.17c-.596.012-1.332.355-1.764.847-.492.56-.917 1.487-.798 2.358.835.048 1.673-.39 2.158-.936.467-.525.823-1.42.72-2.146-.073-.086-.17-.123-.316-.123zM15 14.75c0 1.92 1.447 2.625 1.447 2.625-.01.03-.23.79-.76 1.564-.67 1-1.38 1.99-2.48 2.01-1.08.02-1.43-.64-2.67-.64-1.25 0-1.64.62-2.68.66-1.07.04-1.89-1.07-2.57-2.07-1.41-2.04-2.49-5.78-1.04-8.29.72-1.25 2.01-2.04 3.42-2.06 1.08-.02 2.1.73 2.76.73.66 0 1.89-.9 3.19-.77.54.02 2.06.22 3.03 1.64-.08.05-1.82 1.06-1.82 3.16z"></path></svg>
</button>
<!-- Google -->
<button class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition-all">
<svg class="h-5 w-5" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path></svg>
</button>
<!-- Facebook -->
<button class="flex h-12 w-12 items-center justify-center rounded-full bg-surface-dark border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 transition-all">
<svg class="h-5 w-5 fill-[#1877F2]" viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
</button>
</div>
</div>
<!-- Footer Link -->
<div class="mt-8 text-center pb-6">
<p class="text-slate-400 text-base">
                        Already have an account? 
                        <a class="text-primary font-bold hover:text-sky-300 ml-1 transition-colors" href="#">Log In</a>
</p>
</div>
</div>
</div>
</div>
</body></html>

## Home Feed

<!-- Home Feed Screen -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CineRate Home Feed</title>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&amp;family=Noto+Sans:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#0db9f2",
              "background-light": "#f5f8f8",
              "background-dark": "#101e22",
            },
            fontFamily: {
              "display": ["Be Vietnam Pro", "sans-serif"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary/30">
<div class="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24">
<!-- TopAppBar -->
<header class="sticky top-0 z-40 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
<div class="w-12">
<!-- Spacer for balance if needed, or menu icon -->
</div>
<h2 class="text-slate-900 dark:text-white text-xl font-extrabold leading-tight tracking-[-0.015em] flex-1 text-center">CineRate</h2>
<div class="flex w-12 items-center justify-end">
<button class="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
<span class="material-symbols-outlined text-slate-900 dark:text-white" style="font-size: 24px;">notifications</span>
</button>
</div>
</header>
<!-- Trending Section -->
<section class="flex flex-col pt-4">
<div class="flex items-center justify-between px-4 pb-3 pt-2">
<h2 class="text-slate-900 dark:text-white tracking-tight text-[22px] font-bold leading-tight">Trending Now</h2>
<a class="text-primary text-sm font-medium hover:opacity-80" href="#">See All</a>
</div>
<!-- Horizontal Carousel -->
<div class="flex w-full overflow-x-auto pb-4 px-4 snap-x snap-mandatory scrollbar-hide" style="-ms-overflow-style: none; scrollbar-width: none;">
<div class="flex flex-row items-start justify-start gap-4">
<!-- Card 1 -->
<div class="relative flex-shrink-0 w-44 snap-start group cursor-pointer">
<div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg shadow-black/40">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" data-alt="Dune Part Two movie poster showing desert landscape and characters" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1dvY4a9DIXRDNW4zE8aSBKGdl3TtJmCcysUo5T8cZJ8RWL4GRFz679xqdFv1X3wyzG8C7oTnMpLWqJCtCwubhjkJeku-meUOlBlMMznJP9W3gDxW_6lOC_GrbWT9SIvJtzPwwjGfivgsnOZ-4VNKCMDo_SxT7XPvOpWeuDzxun3MFMkOVO8NudzxizZWRSfIXiJ6XvGeugQe182QP15_uCpkPWs-0Adc75MkWLd7MnvCpgPr4WXsFGFSbJZfk9z5ULLbSZ99RtUQ");'>
</div>
<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<!-- Rating Badge -->
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
<span class="material-symbols-outlined text-primary text-[14px] fill-current" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-white text-xs font-bold">8.8</span>
</div>
<!-- Title Overlay -->
<div class="absolute bottom-3 left-3 right-3">
<h3 class="text-white text-lg font-bold leading-tight line-clamp-2">Dune: Part Two</h3>
<p class="text-gray-300 text-xs mt-1">Sci-Fi • 2024</p>
</div>
</div>
</div>
<!-- Card 2 -->
<div class="relative flex-shrink-0 w-44 snap-start group cursor-pointer">
<div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg shadow-black/40">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" data-alt="Oppenheimer movie poster with Cillian Murphy looking intense" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAStaEQ_-Dm2G3yG7oZkXGm42JnXGORDGgb2_5JHODVancKaoJxDjp6cMCaGjD031zjlgC252UTVYHxien0_S6aaKV58JgTadZaX5bwYh1EWwDd09FMm8jemZun3eJTdk3-Gi7lA5TwKgsJm6KAuMGctruJph8YYsTLH_6E2eSxIL3_9dccYxW5Lq8_DIDIKiyKPOdYUQirCYsuBV_8UyNW-wcXVe3HbYK6dVUYe9DNEEyp4NCzkB8lRgcwbRth-mTvjX-hFFMhRs");'>
</div>
<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
<span class="material-symbols-outlined text-primary text-[14px] fill-current" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-white text-xs font-bold">8.6</span>
</div>
<div class="absolute bottom-3 left-3 right-3">
<h3 class="text-white text-lg font-bold leading-tight line-clamp-2">Oppenheimer</h3>
<p class="text-gray-300 text-xs mt-1">History • 2023</p>
</div>
</div>
</div>
<!-- Card 3 -->
<div class="relative flex-shrink-0 w-44 snap-start group cursor-pointer">
<div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg shadow-black/40">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" data-alt="Spider-Man Across the Spider-Verse movie poster abstract colorful art" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGvxZltLrcHMbR59PCbWK8eXQNN8vUdGJlxDRkcosJLxynII-KipGQM5pRI3iQcwvsDJWagu-XaDgKFy40Hq5GNRAZkndo_NiuaVkZtJynx6lloTvOrwBC5uWpCqoWsNZwA72ufoNKWX9AFb15JDkrGpOsYFxkwJIfUkpH7Di95gRXcqymds29yQ9KOvFWMxJBGmF8QJXbg7z-JfdS2MRhnxNMWE12AyZ_YJj0F_iIM4K2XnHHOyo_isAoyfrXykP14eJ2B5bcXX8");'>
</div>
<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
<span class="material-symbols-outlined text-primary text-[14px] fill-current" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-white text-xs font-bold">8.4</span>
</div>
<div class="absolute bottom-3 left-3 right-3">
<h3 class="text-white text-lg font-bold leading-tight line-clamp-2">Spider-Man: Across the Spider-Verse</h3>
<p class="text-gray-300 text-xs mt-1">Animation • 2023</p>
</div>
</div>
</div>
<!-- Card 4 -->
<div class="relative flex-shrink-0 w-44 snap-start group cursor-pointer">
<div class="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg shadow-black/40">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" data-alt="Mission Impossible Dead Reckoning movie poster showing Tom Cruise" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuC-mVHxG0B_0ehxBhw7skuZuVCsqrKW_Q6tB9ZiTZafZM-JPmDwUwg4HjFlb8o9lqIjMFYqdZ2zVZqGG6XCmyXVNMfh3e7E31JV56Uzq0jinVds-wOJs8q8i-hVMa-5f7oFMWIfCq0OsLhEaMnpyTyDsQ5mlnfYXGPF7Fensjko6qnKEBX9N9fXIj1f4qmV1P2z2lQ_UOgThgM0kvP2pvc0K1VkidFmnayodFLLSJ6DTZis1cRDOha72fL5cEXHfZmZ3aDFXNBzXOw");'>
</div>
<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
<div class="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1 border border-white/10">
<span class="material-symbols-outlined text-primary text-[14px] fill-current" style="font-variation-settings: 'FILL' 1;">star</span>
<span class="text-white text-xs font-bold">7.9</span>
</div>
<div class="absolute bottom-3 left-3 right-3">
<h3 class="text-white text-lg font-bold leading-tight line-clamp-2">Mission: Impossible</h3>
<p class="text-gray-300 text-xs mt-1">Action • 2023</p>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Divider -->
<div class="h-2 bg-transparent"></div>
<!-- In Theaters Grid -->
<section class="flex flex-col">
<h2 class="text-slate-900 dark:text-white tracking-tight text-[22px] font-bold leading-tight px-4 pb-3 pt-2 text-left">In Theaters</h2>
<div class="grid grid-cols-2 gap-4 px-4 pb-4">
<!-- Grid Item 1 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="The Marvels movie poster featuring three female superheroes" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAn48apAHznWZR56gakpN7F_SRZ1c8PawBLFHEwldM3DCpuHImB6-IDnV8cc4Io7W3WaNuqpSkNTbhNGz6ruHQxPBIxmRl9IDLJjHnf_bbcv5byVbQ8cdNEywxYcg8jyCteEUId-llGMzac2Aku6N8eDFRwpEXwrNhrVmy2oJT1rfdI__hUfW1jGVt742YYiw__9Vdo-zTYhEpzvhpsnLc7FRvmEOy1B-Fttg3CLiPbo_cNlc6Nm5QvKMAcdObMSm0u6l_rb-2BKEM");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">The Marvels</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Action • 2023</p>
</div>
</div>
<!-- Grid Item 2 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="Killers of the Flower Moon movie poster showing serious faces" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuANNkyqFzZrC2IZMB76T2SxA7PxXThZVecGewOSy8GiILl6K16ar9v9JSDGiHppVEVsNVrcNt2SRTTDPkdbvezjPRp2ArFlM_7yKm2NRPyQk5zaU2ea_0qGXsVJ0shRmnaEays_rXq6RAYZfBb15tg21Y99HmiQ0npflNUTHxLe5vXp2IpR-6FrYauAg8pb-RsoWqMO6AKtML7SSvzgPUg_BnNfyT9AUKtu0aFL8zPnoUyRxAAZ4x4Qu19bh61UR-XNKR6jtYpbkAE");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">Killers of the Flower Moon</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Crime • 2023</p>
</div>
</div>
<!-- Grid Item 3 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="Napoleon movie poster featuring historical figure in hat" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDkMsgSS21jrOxYiEBxq7JmolXh8ATdl4hGoKn5nPAv1LZdwm74hUe9Jw4XAj2wKXECHWDHQ9KShsgxXopyVu9NQVEKhvnrqIzUcl9q2LPma80aOQEOsTLZ_d1NMBEem28QOdIHEo3phr2wKbx7-I1A5kr4np0xZE5IJ5j_vM6tDfxyS44NyTOAGsb_v_v34huJ4icYF-0hYBkwF4bQvDqW7P7Tdl3dmar2LXM7ocGKcH9bZUc64A6sxHlAoVEQ7fa3cDI_InKLBqs");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">Napoleon</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Biography • 2023</p>
</div>
</div>
<!-- Grid Item 4 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="The Hunger Games Ballad of Songbirds and Snakes movie poster" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4BIP2bgm6UVTqsTprDyyUn-XEXso9tP3lZyWQWXzJS3dXK4AV-yjAChtlC_5MbMGssDP5gY2KPDng96oKhhxRZ1E5iz0316iWJaj-7PvUHYuHiAv_GwfWhU5sb0tNX1ab8pjh_vdGC5_N0s8xWROCEporubRhKshEro5YtpqJxPA42Bi91l1VzSuP4bZS4TMdwEoKksBdeGnOcJ8EBYdhHgWWR9fXXlYoUA2NG2o1S3DRDMWPESjD_G-gGltei9kOPYtvzpAkmCU");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">The Hunger Games</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Action • 2023</p>
</div>
</div>
<!-- Grid Item 5 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="Wonka movie poster colorful fantasy theme" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBdwNOVExqekoRzfDYLJChLou2C_a-xzPH5lubMgbYMhNv8eGwPzr6nZIN4OU6_JQpp3xe5LR5HBn4YyMd8DvxqhD8Pg8yumptICkbBy0dvbETYjebuAsgOstdTEf8NecXHagd5vBp2HK1ZppdQXDGaHLXL3iM8-bjhOLazYzvWuPunpDjmlKksyQMosekKLWyWpGm3Y-0ZAkt1FlDuyMjo12HvQFn22eDm9dh6LKW2Tv9udI4EY-iXZSy4-qKTZSefekUfmLMhDes");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">Wonka</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Fantasy • 2023</p>
</div>
</div>
<!-- Grid Item 6 -->
<div class="flex flex-col gap-2 group cursor-pointer">
<div class="relative w-full aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
<div class="w-full h-full bg-center bg-no-repeat bg-cover transition-opacity hover:opacity-90" data-alt="Aquaman and the Lost Kingdom movie poster underwater scene" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKKhRViaZfDSsFWZWEZQyQ5CwrCBQ1_NDViMBeXFU7LFsphp4IXh3mDAdPkhgZ5yXksye-jvzlcJVozvcjbxKBee9upBfgiMHVfg7jjMa1BPyPLLkCqUyUk1gsSP9U_bawBnOu_9KEYlUMsQIVJcSc-58qAgKBOdGv7t8nWJsDJw-qyE-TrjO4HIuvW0RVq5d-tDJhI5t37kT-ep8SKk2iY-OkywGo6wToON3aPS9UF-hlH6sEeorLoPveOVcYMNLOVXjjFm-_9Ow");'>
</div>
<button class="absolute top-2 right-2 h-8 w-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-primary transition-colors active:scale-95">
<span class="material-symbols-outlined text-[20px]">add</span>
</button>
</div>
<div>
<p class="text-slate-900 dark:text-white text-[15px] font-semibold leading-tight truncate">Aquaman</p>
<p class="text-slate-500 dark:text-[#9cb2ba] text-xs font-normal leading-normal mt-0.5">Action • 2023</p>
</div>
</div>
</div>
</section>
<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-3 bg-white/90 dark:bg-[#152329]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5">
<div class="flex items-center justify-around w-full max-w-md mx-auto">
<button class="flex flex-col items-center gap-1 group w-16">
<span class="material-symbols-outlined text-primary text-[26px] group-hover:scale-110 transition-transform fill-current" style="font-variation-settings: 'FILL' 1;">home</span>
<span class="text-[11px] font-medium text-primary">Home</span>
</button>
<button class="flex flex-col items-center gap-1 group w-16">
<span class="material-symbols-outlined text-slate-400 dark:text-slate-400 text-[26px] group-hover:text-slate-600 dark:group-hover:text-white transition-colors group-hover:scale-110 transform duration-200">search</span>
<span class="text-[11px] font-medium text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors">Search</span>
</button>
<button class="flex flex-col items-center gap-1 group w-16">
<span class="material-symbols-outlined text-slate-400 dark:text-slate-400 text-[26px] group-hover:text-slate-600 dark:group-hover:text-white transition-colors group-hover:scale-110 transform duration-200">person</span>
<span class="text-[11px] font-medium text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors">Profile</span>
</button>
</div>
</nav>
</div>
</body></html>

# Search

<!-- Search Screen -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CineRate Search</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<!-- Material Symbols -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Configuration -->
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#0db9f2",
                        "background-light": "#f5f8f8",
                        "background-dark": "#101e22",
                        "surface-dark": "#1A2C32",
                        "text-secondary": "#9cb2ba",
                    },
                    fontFamily: {
                        "display": ["Be Vietnam Pro", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        @layer utilities {
            .pb-safe {
                padding-bottom: env(safe-area-inset-bottom);
            }
        }
        /* Hide scrollbar for cleaner mobile look */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary/30">
<div class="relative min-h-screen flex flex-col pb-[80px]"> <!-- Added padding bottom for nav bar -->
<!-- Sticky Header with Search -->
<header class="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/5 pt-safe">
<div class="px-4 py-3 w-full max-w-md mx-auto">
<div class="relative flex items-center w-full">
<!-- Search Input Container -->
<div class="flex w-full items-center rounded-lg bg-white dark:bg-surface-dark overflow-hidden shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10 focus-within:ring-2 focus-within:ring-primary transition-shadow">
<div class="flex items-center justify-center pl-4 text-text-secondary">
<span class="material-symbols-outlined text-[24px]">search</span>
</div>
<input class="w-full bg-transparent border-none text-base text-slate-900 dark:text-white placeholder:text-text-secondary focus:ring-0 px-3 py-3 h-12" placeholder="Search movies, actors..." type="text" value="Sci-Fi"/>
<button class="pr-4 text-text-secondary hover:text-primary transition-colors flex items-center justify-center">
<span class="material-symbols-outlined text-[20px]">close</span>
</button>
</div>
</div>
<!-- Optional Filter or Categories Row could go here -->
</div>
</header>
<!-- Main Content Area -->
<main class="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-6">
<!-- Loading Spinner State (Hidden by default for this view, but included structure) -->
<!-- 
            <div class="flex flex-col items-center justify-center py-12 space-y-4">
                <div class="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                <p class="text-text-secondary text-sm">Searching the database...</p>
            </div>
            -->
<!-- Results List -->
<div class="flex flex-col space-y-4">
<div class="flex items-center justify-between pb-2">
<h2 class="text-lg font-bold">Top Results</h2>
<span class="text-xs font-medium text-primary cursor-pointer hover:text-primary/80">See all</span>
</div>
<!-- Result Item 1 -->
<article class="group relative flex items-start gap-4 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors shadow-sm cursor-pointer">
<!-- Poster -->
<div class="shrink-0 w-[72px] h-[108px] rounded-lg bg-gray-800 bg-cover bg-center shadow-md overflow-hidden" data-alt="Dune Part Two movie poster showing desert landscape" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7zqf0YKyR78UPSH_9GMLgD56UGZhHTq4w0DVYn3wiC3CqSaAqnYVNQjpF-gYaq5qjENTkVsAc9GCeSEPcrBVhTf0SJ7LTbNq3ReCuKYIWjQgKy-76zIBcAJXpZQItNcL0jOA0io4GoDrjx2v-x1FS-ptG3Bqs0KXnyj1C924ITcHmFBGlLEyaxuFkFD5psjisbzIVqgk0hzbOOOCsU4Ju23P6TdgvYZpxoW2H-WwMkNjQHO-IkVofTLkeH5uporYem-eJspCYQBA');">
</div>
<!-- Content -->
<div class="flex flex-col flex-1 h-[108px] justify-between py-1">
<div>
<div class="flex justify-between items-start">
<h3 class="text-base font-bold leading-tight line-clamp-2 text-slate-900 dark:text-white pr-2 group-hover:text-primary transition-colors">Dune: Part Two</h3>
<button class="text-text-secondary hover:text-primary">
<span class="material-symbols-outlined text-[24px]">bookmark_add</span>
</button>
</div>
<p class="text-sm text-text-secondary font-medium mt-1">2024 • Sci-Fi, Adventure</p>
</div>
<!-- Rating -->
<div class="flex items-center gap-1.5 self-start bg-primary/10 px-2 py-1 rounded-md">
<span class="material-symbols-outlined text-primary text-[16px] font-variation-FILL-1">star</span>
<span class="text-sm font-bold text-primary">4.8</span>
<span class="text-xs text-text-secondary font-normal ml-1">/ 5</span>
</div>
</div>
</article>
<!-- Result Item 2 -->
<article class="group relative flex items-start gap-4 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors shadow-sm cursor-pointer">
<div class="shrink-0 w-[72px] h-[108px] rounded-lg bg-gray-800 bg-cover bg-center shadow-md overflow-hidden" data-alt="Oppenheimer movie poster abstract fire explosion" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAq61Ze6Ry490Ezu39_dT800uDkV9-w7sd2aB8i_R6ej4fiTH84sVC56FKpugk1PKcy0jylGQQvl1Voc12t4Ny1648PJ6ojllzJ02FEr4USoc4sgNzz4i6ctaFUAkhyUNUGVlFI61AiWvT7JUoI0GaeDRo-dB-8MOh8fiWoLX26jFjQBOd5eEEWMtWwbiu-4LxIRftLmmHOXVm0YNpkIoTI9sBF6N7Kowfl228qxlpz_LnO052jdsqH3_jcG545cK1IlD63CE0oyqc');">
</div>
<div class="flex flex-col flex-1 h-[108px] justify-between py-1">
<div>
<div class="flex justify-between items-start">
<h3 class="text-base font-bold leading-tight line-clamp-1 text-slate-900 dark:text-white pr-2 group-hover:text-primary transition-colors">Oppenheimer</h3>
<button class="text-text-secondary hover:text-primary">
<span class="material-symbols-outlined text-[24px]">bookmark_add</span>
</button>
</div>
<p class="text-sm text-text-secondary font-medium mt-1">2023 • Biography, Drama</p>
</div>
<div class="flex items-center gap-1.5 self-start bg-primary/10 px-2 py-1 rounded-md">
<span class="material-symbols-outlined text-primary text-[16px] font-variation-FILL-1">star</span>
<span class="text-sm font-bold text-primary">4.7</span>
<span class="text-xs text-text-secondary font-normal ml-1">/ 5</span>
</div>
</div>
</article>
<!-- Result Item 3 -->
<article class="group relative flex items-start gap-4 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors shadow-sm cursor-pointer">
<div class="shrink-0 w-[72px] h-[108px] rounded-lg bg-gray-800 bg-cover bg-center shadow-md overflow-hidden" data-alt="The Matrix digital rain code pattern" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAOphF5O9xSO6s3yfgUKlVbA0IMSIlmQhHoUvnCm5gJDWVEMb1DdsnlW5EcM1--EsOJgW63hVkRrp_yjp6pGNCFzvYHPKC25OJ-76pyWsrnp1rBBEPBS2dHYAdVx2YduhYeE76r9OxbYjd_ZPrei2vM6f6q4cTvPYLfs_lHgBpvNkdjje5i42Ce_JwZLGFGy-r4WNFF6PdrP0jDrhmkJyWxIwhlkWxOcikDdtZkvLCk4c29i0VrLUcFekGT7We9gkLvTuOZanXyaek');">
</div>
<div class="flex flex-col flex-1 h-[108px] justify-between py-1">
<div>
<div class="flex justify-between items-start">
<h3 class="text-base font-bold leading-tight line-clamp-1 text-slate-900 dark:text-white pr-2 group-hover:text-primary transition-colors">The Matrix</h3>
<button class="text-text-secondary hover:text-primary">
<span class="material-symbols-outlined text-[24px]">bookmark_add</span>
</button>
</div>
<p class="text-sm text-text-secondary font-medium mt-1">1999 • Sci-Fi, Action</p>
</div>
<div class="flex items-center gap-1.5 self-start bg-primary/10 px-2 py-1 rounded-md">
<span class="material-symbols-outlined text-primary text-[16px] font-variation-FILL-1">star</span>
<span class="text-sm font-bold text-primary">4.9</span>
<span class="text-xs text-text-secondary font-normal ml-1">/ 5</span>
</div>
</div>
</article>
<!-- Result Item 4 -->
<article class="group relative flex items-start gap-4 p-3 rounded-xl bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/5 hover:border-primary/50 transition-colors shadow-sm cursor-pointer">
<div class="shrink-0 w-[72px] h-[108px] rounded-lg bg-gray-800 bg-cover bg-center shadow-md overflow-hidden" data-alt="Interstellar space black hole view" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnmxwwJFqQvp-YdDlKMoeWAOE-3eGwlWXaUoSMwa6yO5jLQRmg1XQBP7NCtIzRzDTNNcODDFOeTFe5D6pvZV3ljGQPU0x_c-0PvUdR6cBupQDI3UzmlGTZ2jfz75fw6nzhJMVShCczKTTt1zulQXQEz4d6SHiAwmFabwnevX7CjT75aq-8bl2JUFTgsF-QvoR84cn71kqFmlEHxgYPpeK5fhHFsz3Hbi-qlZWdsKmo3n4c0aXv9JFFIUKkQSQOw-tkzN_TMJk2ODk');">
</div>
<div class="flex flex-col flex-1 h-[108px] justify-between py-1">
<div>
<div class="flex justify-between items-start">
<h3 class="text-base font-bold leading-tight line-clamp-1 text-slate-900 dark:text-white pr-2 group-hover:text-primary transition-colors">Interstellar</h3>
<button class="text-text-secondary hover:text-primary">
<span class="material-symbols-outlined text-[24px]">bookmark_add</span>
</button>
</div>
<p class="text-sm text-text-secondary font-medium mt-1">2014 • Sci-Fi, Adventure</p>
</div>
<div class="flex items-center gap-1.5 self-start bg-primary/10 px-2 py-1 rounded-md">
<span class="material-symbols-outlined text-primary text-[16px] font-variation-FILL-1">star</span>
<span class="text-sm font-bold text-primary">4.6</span>
<span class="text-xs text-text-secondary font-normal ml-1">/ 5</span>
</div>
</div>
</article>
</div>
<!-- Suggestion / Empty State Hint -->
<div class="pt-4 border-t border-gray-200 dark:border-white/5">
<h3 class="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Related Categories</h3>
<div class="flex flex-wrap gap-2">
<button class="px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-sm font-medium hover:border-primary hover:text-primary transition-colors">Sci-Fi Thriller</button>
<button class="px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-sm font-medium hover:border-primary hover:text-primary transition-colors">Space Opera</button>
<button class="px-4 py-2 rounded-full bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 text-sm font-medium hover:border-primary hover:text-primary transition-colors">Futuristic</button>
</div>
</div>
</main>
<!-- Bottom Navigation -->
<nav class="fixed bottom-0 w-full bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-200 dark:border-white/5 pb-safe z-50">
<div class="max-w-md mx-auto h-16 flex items-center justify-around">
<!-- Home -->
<button class="flex flex-col items-center justify-center w-full h-full space-y-1 text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors group">
<span class="material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-200">home</span>
<span class="text-[10px] font-medium">Home</span>
</button>
<!-- Search (Active) -->
<button class="flex flex-col items-center justify-center w-full h-full space-y-1 text-primary relative">
<!-- Glow effect for active state -->
<div class="absolute -top-[1px] w-12 h-[2px] bg-primary shadow-[0_0_10px_rgba(13,185,242,0.6)] rounded-b-full"></div>
<span class="material-symbols-outlined text-[26px] font-variation-FILL-1">search</span>
<span class="text-[10px] font-medium">Search</span>
</button>
<!-- Profile -->
<button class="flex flex-col items-center justify-center w-full h-full space-y-1 text-text-secondary hover:text-slate-900 dark:hover:text-white transition-colors group">
<span class="material-symbols-outlined text-[26px] group-hover:-translate-y-0.5 transition-transform duration-200">person</span>
<span class="text-[10px] font-medium">Profile</span>
</button>
</div>
</nav>
</div>
</body></html>

## Profile

<!-- Profile Screen -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>CineRate Profile</title>
<!-- Fonts -->
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700;800&amp;family=Noto+Sans:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<!-- Theme Config -->
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#0db9f2",
              "background-light": "#f5f8f8",
              "background-dark": "#101e22",
              "surface-dark": "#18282d",
              "surface-dark-highlight": "#203238",
            },
            fontFamily: {
              "display": ["Be Vietnam Pro", "sans-serif"],
              "body": ["Noto Sans", "sans-serif"],
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-white overflow-x-hidden antialiased selection:bg-primary selection:text-white">
<div class="relative flex h-full min-h-screen w-full flex-col pb-24">
<!-- Top App Bar -->
<header class="sticky top-0 z-20 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-200 dark:border-gray-800">
<div class="w-12">
<!-- Spacer for balance -->
</div>
<h2 class="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">Profile</h2>
<button class="flex w-12 items-center justify-end group">
<span class="material-symbols-outlined text-gray-500 dark:text-[#9cb2ba] group-hover:text-primary transition-colors">logout</span>
</button>
</header>
<!-- Profile Header -->
<section class="flex flex-col items-center pt-6 pb-2 px-4">
<div class="relative mb-4">
<div class="bg-center bg-no-repeat bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-lg shadow-primary/20" data-alt="Portrait of a smiling user named Alex with a blurred city background" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvsMP-YVv34V6PU8fdkfXmxMTp1nqQq0juS13N3DnmJJrimEg0j18hw56GOsvNtggRXIQA8aK2Z9DlOkDa3GZ6-3BQjBtsAbCE_c-bM4H7TOArH9cCblK5FYGiUpOyH_XBg-L-dCU89b0WGsmFKw4oxtnn07HSPt9L45BXQNYkDabUwBwXRFodRKtZJBQmD0XCW4JcztJB_cmJEg50pzOWX2_uxiw8Dia6tf7nzyXVpP0WeTwFo5HQNzfTzF3JGOO9d3Lt47DKDIo");'>
</div>
<div class="absolute bottom-1 right-1 bg-surface-dark-highlight p-1.5 rounded-full border border-gray-700">
<span class="material-symbols-outlined text-primary text-[18px] block">edit</span>
</div>
</div>
<div class="flex flex-col items-center justify-center gap-1">
<h1 class="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight text-center">Alex Cinephile</h1>
<p class="text-gray-500 dark:text-[#9cb2ba] text-sm font-medium leading-normal text-center">Film enthusiast &amp; critic</p>
</div>
</section>
<!-- Profile Stats -->
<section class="flex justify-center gap-3 px-4 py-4 w-full max-w-md mx-auto">
<div class="flex flex-1 flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-3 items-center text-center shadow-sm">
<p class="text-primary tracking-tight text-2xl font-extrabold leading-none">42</p>
<p class="text-gray-500 dark:text-[#9cb2ba] text-xs font-semibold uppercase tracking-wide">Reviews</p>
</div>
<div class="flex flex-1 flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-3 items-center text-center shadow-sm">
<p class="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-none">156</p>
<p class="text-gray-500 dark:text-[#9cb2ba] text-xs font-semibold uppercase tracking-wide">Following</p>
</div>
<div class="flex flex-1 flex-col gap-1 rounded-xl bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-800 p-3 items-center text-center shadow-sm">
<p class="text-gray-900 dark:text-white tracking-tight text-2xl font-bold leading-none">890</p>
<p class="text-gray-500 dark:text-[#9cb2ba] text-xs font-semibold uppercase tracking-wide">Followers</p>
</div>
</section>
<div class="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
<!-- Section Header -->
<div class="px-5 pt-4 pb-2 flex items-center justify-between">
<h2 class="text-gray-900 dark:text-white text-xl font-bold leading-tight">My Reviews</h2>
<button class="text-primary text-sm font-semibold hover:text-primary/80">View all</button>
</div>
<!-- Review List -->
<div class="flex flex-col gap-4 p-4">
<!-- Card 1 -->
<article class="group relative flex gap-4 rounded-xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
<!-- Movie Poster -->
<div class="w-20 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg aspect-[2/3] shadow-md" data-alt="Movie poster for Dune: Part Two featuring desert landscape and characters" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuA8UGjTSemieHgGbRsXWbeO6rP_cmtl4NjJoWKqRG0B5iIpWVlRbdWm-mJYS5GLc3S-_B0zeUBIojw-786TZVF0UDLPFuNMoAejOATK_6Ng96gcQTH0vnnCLfJsGjvCInYgiy1lany8Z1RdUyAcVtUc93Bktb-OxdDroHW3zY_vDGPufqXADDcC3ipdMs27X6YIIWART61mj8jwYM8yRw6QyACatj0bK010AVlyL-0q2pQbddaWSbT8sJG4YEM9oEgoLGlycomf54Y");'>
</div>
<div class="flex flex-col flex-1 py-1 gap-1">
<div class="flex justify-between items-start">
<div>
<h3 class="text-gray-900 dark:text-white text-base font-bold leading-tight">Dune: Part Two</h3>
<p class="text-gray-400 dark:text-gray-500 text-xs font-medium mt-0.5">2024 • Sci-Fi</p>
</div>
<span class="text-[10px] text-gray-400 dark:text-gray-600 font-medium whitespace-nowrap">2d ago</span>
</div>
<div class="flex items-center gap-0.5 my-1">
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
</div>
<p class="text-gray-600 dark:text-[#9cb2ba] text-sm font-normal leading-snug line-clamp-2">
                        A visual masterpiece that surpasses the first. The sound design is incredible and the pacing keeps you on edge.
                    </p>
</div>
</article>
<!-- Card 2 -->
<article class="group relative flex gap-4 rounded-xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
<!-- Movie Poster -->
<div class="w-20 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg aspect-[2/3] shadow-md" data-alt="Abstract movie poster with dark blue and red neon lights" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJEthlh6TXXisok6oVxzeTrNLiR0X1z-ZSR4FEAg8VwPgFZWu39DfYAdqqA-GzChV2i_EdW-QBFsLLicMIG-m1jnM1n-QYc0dqb3UaEr_VcumWV8VWkzOAYuz4jB9nUMKT9OPWnQ5NzelUc1ofZBpKDsP9OmA-GQFmIWvAQW95bdCc5McwXTOPhp1sppkPJPcIiYqEfNATaduZNdcHXxEo1I_yiT2vQbtXrBMiKTptFGXXEio3mRGA4_c7TueMsve6yVBRilHm_bQ");'>
</div>
<div class="flex flex-col flex-1 py-1 gap-1">
<div class="flex justify-between items-start">
<div>
<h3 class="text-gray-900 dark:text-white text-base font-bold leading-tight">Civil War</h3>
<p class="text-gray-400 dark:text-gray-500 text-xs font-medium mt-0.5">2024 • Action</p>
</div>
<span class="text-[10px] text-gray-400 dark:text-gray-600 font-medium whitespace-nowrap">5d ago</span>
</div>
<div class="flex items-center gap-0.5 my-1">
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-gray-600 text-[18px]">star</span>
</div>
<p class="text-gray-600 dark:text-[#9cb2ba] text-sm font-normal leading-snug line-clamp-2">
                        Intense and terrifyingly realistic. Garland delivers a gut-punch of a film about journalism.
                    </p>
</div>
</article>
<!-- Card 3 -->
<article class="group relative flex gap-4 rounded-xl bg-white dark:bg-surface-dark p-3 shadow-sm border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors">
<!-- Movie Poster -->
<div class="w-20 shrink-0 bg-center bg-no-repeat bg-cover rounded-lg aspect-[2/3] shadow-md" data-alt="Vintage style movie poster with warm colors" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSLvq1rGLeKEFmUKG4WFtQKEm-5ygxxeQFOcIiIfvX40O0vyCloR079cuECiFCcNrKvAqkiopoj87soNteqLWO9A9WgWL1t6YNFmOI8K9Kg7MNEW-2LPvDvNsQQ5XMunyhW0Tn592DuNViBcN3k7VDkr5mII6etZOR6LsPATXw51WRZlompvBJntBDB1ylovHHxBxAlRFv183UjnfQOeoK4Idpw_8_wHU1B-4-wbmobg6cWWRAO00O55Dab_gnRre-Re9j71CCM2k");'>
</div>
<div class="flex flex-col flex-1 py-1 gap-1">
<div class="flex justify-between items-start">
<div>
<h3 class="text-gray-900 dark:text-white text-base font-bold leading-tight">The Holdovers</h3>
<p class="text-gray-400 dark:text-gray-500 text-xs font-medium mt-0.5">2023 • Comedy</p>
</div>
<span class="text-[10px] text-gray-400 dark:text-gray-600 font-medium whitespace-nowrap">1w ago</span>
</div>
<div class="flex items-center gap-0.5 my-1">
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
<span class="material-symbols-outlined text-primary text-[18px] fill-1">star</span>
</div>
<p class="text-gray-600 dark:text-[#9cb2ba] text-sm font-normal leading-snug line-clamp-2">
                        Instant classic. Paul Giamatti is phenomenal in this heartwarming holiday story.
                    </p>
</div>
</article>
</div>
<!-- Bottom Navigation -->
<nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 pb-safe">
<div class="flex items-center justify-around h-16">
<!-- Home -->
<a class="flex flex-col items-center justify-center w-full h-full gap-1 group" href="#">
<span class="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors text-2xl">home</span>
<span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">Home</span>
</a>
<!-- Search -->
<a class="flex flex-col items-center justify-center w-full h-full gap-1 group" href="#">
<span class="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors text-2xl">search</span>
<span class="text-[10px] font-medium text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">Search</span>
</a>
<!-- Profile (Active) -->
<a class="flex flex-col items-center justify-center w-full h-full gap-1 group" href="#">
<span class="material-symbols-outlined text-primary fill-1 text-2xl shadow-glow">person</span>
<span class="text-[10px] font-bold text-primary">Profile</span>
</a>
</div>
<!-- iOS Home Indicator Safe Area spacing (simulated) -->
<div class="h-5 w-full bg-white dark:bg-surface-dark"></div>
</nav>
</div>
</body></html>
