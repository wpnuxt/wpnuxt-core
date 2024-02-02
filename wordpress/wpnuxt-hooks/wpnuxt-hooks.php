<?php
/**
 * @package WPNuxt_Hooks
 * @version 0.0.2
 */
/*
Plugin Name: WPNuxt: Hooks
Plugin URI: https://wpnuxt.com
Description: WordPress hooks for WPNuxt. Invalidate Nuxt cache on post update. Depends on the Faust.js™ plugin.
Author: Wouter Vernaillen
Version: 0.0.2
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

function my_project_updated_send_email( $post_id ) {

  // If this is just a revision, don't purge the cache and send the email.
  if ( wp_is_post_revision( $post_id ) ) {
    return;
  }

  $faustwp_settings = get_option( 'faustwp_settings' );
  $frontend_uri = $faustwp_settings['frontend_uri'];
  $purge_url = $frontend_uri . '/__nuxt_multi_cache/purge/all';

  $headers = array( 'x-nuxt-multi-cache-token' => 'wpnuxt-cache' );
  $response = Requests::post( $purge_url, $headers );

  $admin_email = get_option( 'admin_email' );
  $post_title = get_the_title( $post_id );
  $post_url = get_permalink( $post_id );
  $subject = 'A post has been updated';

  $message = "A post has been updated on your website:\n\n";
  $message .= $post_title . ": " . $post_url . "\n\n result of cache purge at " . $purge_url . ":\n\nstatus: " . $response->status . " \nbody: " . $response->body . "\n\n";

  // Send email to admin.
  wp_mail( $admin_email, $subject, $message );
}
add_action( 'save_post', 'my_project_updated_send_email' );

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
