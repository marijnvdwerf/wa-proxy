package nl.codesoup.waproxy;

import android.content.Intent;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class PebblePlugin extends CordovaPlugin {

    public static String ACTION_NOTIFY_PEBBLE = "pebbleNotification";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (ACTION_NOTIFY_PEBBLE.equals(action)) {
            final Intent i = new Intent("com.getpebble.action.SEND_NOTIFICATION");

            JSONObject object = args.getJSONObject(0);

            String sender = object.getString("sender");
            String message = object.getString("message");

            final Map data = new HashMap();
            data.put("title", sender);
            data.put("body", message);
            final JSONObject jsonData = new JSONObject(data);
            final String notificationData = new JSONArray().put(jsonData).toString();

            i.putExtra("messageType", "PEBBLE_ALERT");
            i.putExtra("sender", "MyAndroidApp");
            i.putExtra("notificationData", notificationData);

            Log.d(ACTION_NOTIFY_PEBBLE, "About to send a modal alert to Pebble: " + notificationData);
            cordova.getActivity().sendBroadcast(i);
        }
        return super.execute(action, args, callbackContext);
    }
}
