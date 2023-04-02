export class Entity {
    static doReflection(entity, target, env_pos) {
        entity.sprite.element.style.zIndex = entity.zIndex;
        entity.sprite.element.style.transform = "scaleX(-1)";
        entity.sprite.animation = target.sprite.animation + 4;
        if (entity.sprite.animation > 7) {
            entity.sprite.animation -= 8;
        }
        entity.sprite.frame = target.sprite.frame;
        entity.sprite.img = target.sprite.img;
        entity.sprite.updateSpritePosition({x: target.position.x - entity.sprite.size.w, y: entity.startAtY - (target.position.y - target.sprite.size.h - entity.startAtY) + env_pos.y + entity.sprite.size.h});
        entity.sprite.doAnimFrame();
    }
}