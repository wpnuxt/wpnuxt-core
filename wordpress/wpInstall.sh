#!/bin/sh
echo "--------------------------------------------------------------------";
echo "-------------------- executing wpInstall script --------------------";
echo "--------------------------------------------------------------------";

wp core install --allow-root --url="http://wordpress.local" --title="WPNuxt Demo" --admin_user=admin --admin_password=admin123 --admin_email=wouter@vernaillen.dev;

if [ $(wp option get wpnuxt_installed) == 1 ]; then
  echo "WPNuxt is already installed.";
else
  echo "----------------- starting plugin install/update: -----------------";
  wp option update permalink_structure /%postname%/;

  wp plugin is-installed hello;
  if [ $? == 0 ]; then wp plugin delete hello; fi

  #wp plugin is-installed "enable-cors";
  #if [ $? == 1 ]; then wp plugin install --activate "enable-cors"; fi

  wp plugin is-installed "faustwp";
  if [ $? == 1 ]; then wp plugin install --activate "faustwp"; fi

  wp plugin is-installed "wp-graphql";
  if [ $? == 1 ]; then wp plugin install --activate "wp-graphql"; fi

  wp plugin is-installed "wp-graphql-content-blocks";
  if [ $? == 1 ]; then wp plugin install --activate "https://github.com/wpengine/wp-graphql-content-blocks/releases/download/v2.0.0/wp-graphql-content-blocks.zip"; fi

  wp plugin update-all;
  wp plugin activate --all;

  echo "----------------- finished plugin install/update: -----------------";
  wp plugin list;
  echo "-------------------------------------------------------------------";

  echo "----------------- starting plugin configuration: ------------------";

  wp option patch insert faustwp_settings frontend_uri "http://app.local:3000";
  wp option patch insert faustwp_settings disable_theme 1;
  wp option patch insert faustwp_settings enable_redirects 1;
  wp option patch insert faustwp_settings enable_rewrites 1;
  wp option patch insert faustwp_settings enable_telemetry 1;
  wp option patch insert faustwp_settings enable_image_source 1;
  wp option patch insert faustwp_settings secret_key 64489e3c-1166-498a-9a6e-51cbb4c14ab2;
  wp option add graphql_general_settings {} --format=json;
  wp option patch insert graphql_general_settings public_introspection_enabled on;

  echo "----------------- creating content: -------------------------------";

  wp menu create main;
  post_id="$(wp post create --post_type=page --post_title="Test Page" --post_content="This is my test page" --post_status=publish --porcelain)";
  wp menu item add-post main $post_id --title="Test Page";
  wp menu item add-custom main WP-Admin http://wordpress.local/wp-admin;
  wp menu location assign main primary;
  wp menu location list;

  wp option add wpnuxt_installed 1;
  echo "----------------- WPNuxt installed successfully: --------------------";
fi

echo "----------------- (re-)install WPNuxt Hooks: -----------------------";

wp plugin is-installed "wpnuxt-hooks";
if [ $? == 1 ]; then wp plugin install --activate /tmp/wpnuxt-hooks.zip; fi
