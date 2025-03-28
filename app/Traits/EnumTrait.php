<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait EnumTrait
{
    /**
     * Set a given attribute on the model.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return $this
     */
    public function setAttribute($key, $value)
    {
        if ($enum = $this->getEnum($key)) {
            $enumValues = constant("self::$enum");

            if (is_string($value)) {
                $value = Str::singular($value);
                if (isset($enumValues[$value])) {
                    $this->attributes[$key] = $enumValues[$value];
                    return $this;
                }
            }
            else if (is_int($value) && in_array($value, $enumValues)) {
                $this->attributes[$key] = $value;
                return $this;
            }
        }
        return parent::setAttribute($key, $value);
    }

    /**
     * Get an attribute from the model.
     *
     * @param  string  $key
     * @return mixed
     */
    public function getAttribute($key)
    {
        if ($enum = $this->getEnum($key)) {
            if (isset($this->attributes[$key])) {
                $enumValues = constant("self::$enum");
                $value = $this->attributes[$key];

                $stringKey = array_search($value, $enumValues);
                if ($stringKey !== false) {
                    return $stringKey;
                }
            }
            return null;
        }

        $keyWithoutIdAtTheEnd = rtrim($key, '_id');
        if ($keyWithoutIdAtTheEnd !== $key && $this->getEnum($keyWithoutIdAtTheEnd)) {
            return isset($this->attributes[$keyWithoutIdAtTheEnd]) ?
                $this->attributes[$keyWithoutIdAtTheEnd] : null;
        }

        return parent::getAttribute($key);
    }

    /**
     * Handle dynamic static method calls into the model.
     *
     * @param  string  $method
     * @param  array  $parameters
     * @return mixed
     */
    public static function __callStatic($method, $parameters)
    {
        $pattern = '/^get(([A-Z][a-z]+)+)I[dD]$/';
        if (preg_match($pattern, $method, $matches)) {
            $key = Str::snake($matches[1]);
            if ($enum = static::getEnum($key)) {
                if (!isset($parameters[0])) {
                    return null;
                }

                $value = $parameters[0];
                if (is_string($value)) {
                    $value = Str::singular(strtolower($value));
                    $enumValues = constant("self::$enum");
                    return isset($enumValues[$value]) ? $enumValues[$value] : null;
                }
            }
        }

        return parent::__callStatic($method, $parameters);
    }

    /**
     * Get the enum constant name for a given key.
     *
     * @param  string  $key
     * @return string|null
     */
    public static function getEnum($key)
    {
        if (!property_exists(static::class, 'enums') || !is_array(static::$enums)) {
            return null;
        }

        return array_search($key, static::$enums);
    }
}
