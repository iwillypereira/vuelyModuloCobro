/**
 * App Config File
 */
export default {
	appLogo: '/static/img/rmt/rmt.png',                                  // App Logo,
	darkLogo: '/static/img/rmt/rmt.png',							    // dark logo
	appLogo2: '/static/img/session.png',                                    // App Logo 2 For Login & Signup Page
	brand: 'Ruta Maya Travel',                                        			        // Brand Name
	copyrightText: 'RMT © 2020 Todos los derechos reservados.',             // Copyright Text
	enableUserTour: process.env.NODE_ENV === 'production' ? true : false,   // Enable User Tour
	weatherApiId: 'b1b15e88fa797225412429c1c50c122a1',						// weather API Id
	weatherApiKey: '69b72ed255ce5efad910bd946685883a'						// weather APi key
}
