export class Entity {
    static doReflection(entity, target, env_pos) {
        entity.sprite.element.style.zIndex = entity.zIndex;
        entity.sprite.frame = target.sprite.frame;
        entity.sprite.img = target.sprite.img;
        if(entity.reflectionTop) {
            //mirror reflection
            entity.sprite.element.style.transform = "scaleX(-1)";
            entity.sprite.animation = target.sprite.animation + 4;
            if (entity.sprite.animation > 7) {
                entity.sprite.animation -= 8;
            }
            entity.sprite.updateSpritePosition({x: target.position.x - entity.sprite.size.w, y: 2 * entity.startAtY - target.position.y + target.sprite.size.h + env_pos.y + entity.sprite.size.h});
        } else {
            //water reflection
            entity.sprite.element.style.transform = "scaleY(-1)";
            entity.sprite.animation = target.sprite.animation;
            entity.sprite.updateSpritePosition({x: target.position.x - 2 * entity.sprite.size.w, y: target.position.y + entity.sprite.size.h - entity.startAtY});
        }
        entity.sprite.doAnimFrame();
    }
}