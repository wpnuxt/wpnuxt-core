<?php
/**
 * @package WPNuxt_WP_Hook
 * @version 0.0.1
 */
/*
Plugin Name: WPNuxt Hooks
Plugin URI: https://wpnuxt.com
Description: WordPress hooks for WPNuxt. Invalidate Nuxt cache on post update. Depends on the Faust.js™ plugin.
Author: Wouter Vernaillen
Version: 0.0.1
Author URI: https://vernaillen.dev
*/

function my_project_updated_send_email( $post_id ) {

  // If this is just a revision, don't purge the cache and send the email.
  if ( wp_is_post_revision( $post_id ) ) {
    return;
  }

  $faustwp_settings = get_option( 'faustwp_settings' );
  $frontend_uri = $faustwp_settings['frontend_uri'];
  $purge_url = $frontend_uri . '/__nuxt_multi_cache/purge/all';
  $admin_email = get_option( 'admin_email' );

  $headers = array( 'x-nuxt-multi-cache-token' => 'hunter2' );
  $response = Requests::post( $purge_url, $headers );

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

        deactivate_plugins( plugin_basename( __FILE__ ) );

        if ( isset( $_GET['activate'] ) ) {
            unset( $_GET['activate'] );
        }
    }
}

function child_plugin_notice(){
    ?><div class="error"><p>Sorry, but the WPNuxt Hooks plugin requires the Faust.js™ plugin to be installed and active. Check https://wpnuxt.com for more info.</p></div><?php
}
