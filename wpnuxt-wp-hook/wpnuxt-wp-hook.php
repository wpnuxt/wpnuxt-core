<?php
/**
 * @package WPNuxt_WP_Hook
 * @version 0.0.1
 */
/*
Plugin Name: WPNuxt Hooks
Plugin URI: https://wpnuxt.com
Description: WordPress hooks for WPNuxt. Invalidate Nuxt cache on post update.
Author: Wouter Vernaillen
Version: 0.0.1
Author URI: https://vernaillen.dev
*/

function my_project_updated_send_email( $post_id ) {

  // If this is just a revision, don't send the email.
  if ( wp_is_post_revision( $post_id ) ) {
    return;
  }

  $url = curl_init('https://demo.wpnuxt.com/__nuxt_multi_cache/purge/all');

  curl_setopt($url, CURLOPT_CUSTOMREQUEST, "POST");
  curl_setopt($url, CURLOPT_HTTPHEADER, array(
      'x-nuxt-multi-cache-token: hunter2'
  ));
  // The results of our request, to use later if we want.
  $result = curl_exec($url);

  $post_title = get_the_title( $post_id );
  $post_url = get_permalink( $post_id );
  $subject = 'A post has been updated';

  $message = "A post has been updated on your website:\n\n";
  $message .= $post_title . ": " . $post_url . "\n\n result of cache purge:\n\n" . $result . "\n\n";

  // Send email to admin.
  wp_mail( 'wouter@vernaillen.dev', $subject, $message );
}
add_action( 'save_post', 'my_project_updated_send_email' );
