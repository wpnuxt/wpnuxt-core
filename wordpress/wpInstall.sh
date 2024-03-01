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

  wp option patch insert faustwp_settings frontend_uri "http://localhost:3001";
  wp option patch insert faustwp_settings disable_theme 1;
  wp option patch insert faustwp_settings enable_redirects 1;
  wp option patch insert faustwp_settings enable_rewrites 1;
  wp option patch insert faustwp_settings enable_telemetry 1;
  wp option patch insert faustwp_settings enable_image_source 1;
  wp option patch insert faustwp_settings secret_key 64489e3c-1166-498a-9a6e-51cbb4c14ab2;
  wp option add graphql_general_settings {} --format=json;
  wp option patch insert graphql_general_settings public_introspection_enabled on;
  wp option patch insert graphql_general_settings show_graphiql_link_in_admin_bar off;

  echo "----------------- creating content: -------------------------------";

  ls -al /tmp;
  ls -al /tmp/demo-content;
  wp menu create main;
  post_id="$(wp post create /tmp/demo-content/testpage-content.txt --post_type=page --post_title="Test Page" --post_status=publish --porcelain)";
  wp menu item add-post main $post_id --title="Test Page";
  wp menu location assign main primary;
  wp menu location list;

  wp option add wpnuxt_installed 1;

fi

  echo "----------------- install WPNuxt WordPress Plugin: -----------------------";

  cd /tmp;
  #zip -r wpnuxt-hooks.zip ./wpnuxt-hooks;
  #cp wpnuxt-hooks.zip /var/www/html/;
  zip -r wpnuxt-plugin.zip ./wpnuxt-plugin;
  cd /var/www/html;

  #wp plugin is-installed "wpnuxt-hooks";
  #if [ $? == 1 ]; then wp plugin install --activate /tmp/wpnuxt-hooks.zip; fi

  wp plugin is-installed "wpnuxt-plugin";
  if [ $? == 1 ]; then wp plugin install --activate /tmp/wpnuxt-plugin.zip; fi

  echo "----------------- WPNuxt installed successfully: --------------------";
