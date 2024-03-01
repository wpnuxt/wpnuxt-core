<?php
/**
 * @package WPNuxt_Plugin
 * @version 0.0.1
 */
/*
Plugin Name: WPNuxt
Plugin URI: https://wpnuxt.com
Description: WPNuxt: headless WordPress for a Nuxt front-end. Depends on the Faust.js™ plugin.
Author: Wouter Vernaillen
Version: 0.0.1
Author URI: https://vernaillen.dev
*/

class AdminNotice
{
    const NOTICE_FIELD = 'my_admin_notice_message';

    public function displayAdminNotice()
    {
        $option      = get_option(self::NOTICE_FIELD);
        $message     = isset($option['message']) ? $option['message'] : false;
        $noticeLevel = ! empty($option['notice-level']) ? $option['notice-level'] : 'notice-error';

        if ($message) {
            echo "<div class='notice {$noticeLevel} is-dismissible'><p>{$message}</p></div>";
            delete_option(self::NOTICE_FIELD);
        }
    }

    public static function displayError($message)
    {
        self::updateOption($message, 'notice-error');
    }

    public static function displayWarning($message)
    {
        self::updateOption($message, 'notice-warning');
    }

    public static function displayInfo($message)
    {
        self::updateOption($message, 'notice-info');
    }

    public static function displaySuccess($message)
    {
        self::updateOption($message, 'notice-success');
    }

    protected static function updateOption($message, $noticeLevel) {
        update_option(self::NOTICE_FIELD, [
            'message' => $message,
            'notice-level' => $noticeLevel
        ]);
    }
}
add_action('admin_notices', [new AdminNotice(), 'displayAdminNotice']);

function post_updated( $post_id ) {

  // If this is just a revision, don't continue.
  if ( wp_is_post_revision( $post_id ) ) {
    return;
  }
  update_option( 'wpnuxt_staging', 'true' );
  AdminNotice::displayInfo('Post updated');
}
add_action( 'save_post', 'post_updated' );

add_action( 'admin_init', 'has_faustwp_plugin' );
function has_faustwp_plugin() {
    if ( is_admin() && current_user_can( 'activate_plugins' ) &&  !is_plugin_active( 'faustwp/faustwp.php' ) ) {
        add_action( 'admin_notices', 'child_plugin_notice' );

        AdminNotice::displayError('The WPNuxt Hooks plugin requires the Faust.js™ plugin to be installed and activated. Check https://wpnuxt.com for more info.' . $admin_email);

        deactivate_plugins( plugin_basename( __FILE__ ) );

        if ( isset( $_GET['activate'] ) ) {
            unset( $_GET['activate'] );
        }
    }
}

function init_wpnuxt() {
  add_option( 'wpnuxt_staging', '' );
}
add_action( 'init', 'init_wpnuxt' );

add_action('admin_menu', 'wpnuxt_setup_menu');

function wpnuxt_setup_menu(){
    $nuxtIcon = 'data:image/svg+xml;base64,' . base64_encode('<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z" fill="#00DC82"/></svg>');
    add_menu_page( 'WPNuxt Page', 'WPNuxt', 'manage_options', 'wpnuxt-settings', 'wpnuxt_settings_page', $nuxtIcon, 25 );
}

function wpnuxt_settings_page(){
    $faustwp_settings = get_option( 'faustwp_settings' );
    $frontend_uri = $faustwp_settings['frontend_uri'];

		$nuxtIcon = 'data:image/svg+xml;base64,' . base64_encode('<svg width="40" height="40" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z" fill="#00DC82"/></svg>');
		$icon = sprintf(
			'<span class="custom-icon" style="
    background-image:url(\'%s\'); float:left; width:40px !important; height:40px !important;
    margin-top: -10px !important; margin-right: 0 !important;
    "></span>',
			$nuxtIcon
		);

    echo "<h1>" . $icon . " WPNuxt</h1>";
    echo "<p>WPNuxt is a headless WordPress plugin for Nuxt.js. It depends on the Faust.js™ plugin.</p>";
    $isUpdated = get_option( 'wpnuxt_staging' );
    if ($isUpdated) {
        echo "<p>Er zijn niet gepubliceerde wijzigingen</p>";
        echo "<p class=\"submit\"><input type=\"submit\" name=\"submit\" id=\"submit\" class=\"button button-primary\" value=\"Publiceer\"></p>";
    } else {
        echo "<p>Alle wijzigingen zijn gepubliceerd</p>";
    }
    echo "<p><a href=\"". $frontend_uri ."\" target=\"_blank\">Open live site</a></p>";
}

	/**
	 * Registers admin bar menu
	 *
	 * @param \WP_Admin_Bar $admin_bar The Admin Bar Instance
	 *
	 * @return void
	 */
	function register_admin_bar_menu( WP_Admin_Bar $admin_bar ) {
		if ( ! current_user_can( 'manage_options' )) {
			return;
		}

		$nuxtIcon = 'data:image/svg+xml;base64,' . base64_encode('<svg width="22" height="22" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M281.44 397.667H438.32C443.326 397.667 448.118 395.908 452.453 393.427C456.789 390.946 461.258 387.831 463.76 383.533C466.262 379.236 468.002 374.36 468 369.399C467.998 364.437 466.266 359.563 463.76 355.268L357.76 172.947C355.258 168.65 352.201 165.534 347.867 163.053C343.532 160.573 337.325 158.813 332.32 158.813C327.315 158.813 322.521 160.573 318.187 163.053C313.852 165.534 310.795 168.65 308.293 172.947L281.44 219.587L227.733 129.13C225.229 124.834 222.176 120.307 217.84 117.827C213.504 115.346 208.713 115 203.707 115C198.701 115 193.909 115.346 189.573 117.827C185.238 120.307 180.771 124.834 178.267 129.13L46.8267 355.268C44.3208 359.563 44.0022 364.437 44 369.399C43.9978 374.36 44.3246 379.235 46.8267 383.533C49.3288 387.83 53.7979 390.946 58.1333 393.427C62.4688 395.908 67.2603 397.667 72.2667 397.667H171.2C210.401 397.667 238.934 380.082 258.827 346.787L306.88 263.4L332.32 219.587L410.053 352.44H306.88L281.44 397.667ZM169.787 352.44H100.533L203.707 174.36L256 263.4L221.361 323.784C208.151 345.387 193.089 352.44 169.787 352.44Z" fill="#00DC82"/></svg>');
    $icon_url = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cGF0aCBmaWxsPSIjRTEwMDk4IiBkPSJNNTcuNDY4IDMwMi42NmwtMTQuMzc2LTguMyAxNjAuMTUtMjc3LjM4IDE0LjM3NiA4LjN6Ii8+PHBhdGggZmlsbD0iI0UxMDA5OCIgZD0iTTM5LjggMjcyLjJoMzIwLjN2MTYuNkgzOS44eiIvPjxwYXRoIGZpbGw9IiNFMTAwOTgiIGQ9Ik0yMDYuMzQ4IDM3NC4wMjZsLTE2MC4yMS05Mi41IDguMy0xNC4zNzYgMTYwLjIxIDkyLjV6TTM0NS41MjIgMTMyLjk0N2wtMTYwLjIxLTkyLjUgOC4zLTE0LjM3NiAxNjAuMjEgOTIuNXoiLz48cGF0aCBmaWxsPSIjRTEwMDk4IiBkPSJNNTQuNDgyIDEzMi44ODNsLTguMy0xNC4zNzUgMTYwLjIxLTkyLjUgOC4zIDE0LjM3NnoiLz48cGF0aCBmaWxsPSIjRTEwMDk4IiBkPSJNMzQyLjU2OCAzMDIuNjYzbC0xNjAuMTUtMjc3LjM4IDE0LjM3Ni04LjMgMTYwLjE1IDI3Ny4zOHpNNTIuNSAxMDcuNWgxNi42djE4NUg1Mi41ek0zMzAuOSAxMDcuNWgxNi42djE4NWgtMTYuNnoiLz48cGF0aCBmaWxsPSIjRTEwMDk4IiBkPSJNMjAzLjUyMiAzNjdsLTcuMjUtMTIuNTU4IDEzOS4zNC04MC40NSA3LjI1IDEyLjU1N3oiLz48cGF0aCBmaWxsPSIjRTEwMDk4IiBkPSJNMzY5LjUgMjk3LjljLTkuNiAxNi43LTMxIDIyLjQtNDcuNyAxMi44LTE2LjctOS42LTIyLjQtMzEtMTIuOC00Ny43IDkuNi0xNi43IDMxLTIyLjQgNDcuNy0xMi44IDE2LjggOS43IDIyLjUgMzEgMTIuOCA0Ny43TTkwLjkgMTM3Yy05LjYgMTYuNy0zMSAyMi40LTQ3LjcgMTIuOC0xNi43LTkuNi0yMi40LTMxLTEyLjgtNDcuNyA5LjYtMTYuNyAzMS0yMi40IDQ3LjctMTIuOCAxNi43IDkuNyAyMi40IDMxIDEyLjggNDcuN00zMC41IDI5Ny45Yy05LjYtMTYuNy0zLjktMzggMTIuOC00Ny43IDE2LjctOS42IDM4LTMuOSA0Ny43IDEyLjggOS42IDE2LjcgMy45IDM4LTEyLjggNDcuNy0xNi44IDkuNi0zOC4xIDMuOS00Ny43LTEyLjhNMzA5LjEgMTM3Yy05LjYtMTYuNy0zLjktMzggMTIuOC00Ny43IDE2LjctOS42IDM4LTMuOSA0Ny43IDEyLjggOS42IDE2LjcgMy45IDM4LTEyLjggNDcuNy0xNi43IDkuNi0zOC4xIDMuOS00Ny43LTEyLjhNMjAwIDM5NS44Yy0xOS4zIDAtMzQuOS0xNS42LTM0LjktMzQuOSAwLTE5LjMgMTUuNi0zNC45IDM0LjktMzQuOSAxOS4zIDAgMzQuOSAxNS42IDM0LjkgMzQuOSAwIDE5LjItMTUuNiAzNC45LTM0LjkgMzQuOU0yMDAgNzRjLTE5LjMgMC0zNC45LTE1LjYtMzQuOS0zNC45IDAtMTkuMyAxNS42LTM0LjkgMzQuOS0zNC45IDE5LjMgMCAzNC45IDE1LjYgMzQuOSAzNC45IDAgMTkuMy0xNS42IDM0LjktMzQuOSAzNC45Ii8+PC9zdmc+';

		$icon = sprintf(
			'<span class="custom-icon" style="
    background-image:url(\'%s\'); float:left; width:22px !important; height:22px !important;
    margin-left: 5px !important; margin-top: 5px !important; margin-right: 2px !important;
    "></span>',
			$nuxtIcon
		);

		$admin_bar->add_menu(
			[
				'id'    => 'wpnuxt',
				'title' => $icon . __( 'WPNuxt', 'wpnuxt' ),
				'href'  => trailingslashit( admin_url() ) . 'admin.php?page=wpnuxt-settings',
			]
		);
	}
  add_action( 'admin_bar_menu', 'register_admin_bar_menu', 500);


  function isUpdated () {
    $isUpdated = get_option( 'wpnuxt_staging' );
    return $isUpdated;
  }
  add_action( 'rest_api_init', function () {
    register_rest_route( 'wpnuxt/v1', '/updated', array(
      'methods' => 'GET',
      'callback' => 'isUpdated',
    ) );
  } );

  if (is_admin()) {
    function jba_disable_editor_fullscreen_by_default() {
      $script = "jQuery( window ).load(function() { const isFullscreenMode = wp.data.select( 'core/edit-post' ).isFeatureActive( 'fullscreenMode' ); if ( isFullscreenMode ) { wp.data.dispatch( 'core/edit-post' ).toggleFeature( 'fullscreenMode' ); } });";
      wp_add_inline_script( 'wp-blocks', $script );
    }
    add_action( 'enqueue_block_editor_assets', 'jba_disable_editor_fullscreen_by_default' );
  }
?>
